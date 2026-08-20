#!/usr/bin/env bash
#
# Durcissement de base d'un VPS Debian/Ubuntu accueillant PERFUMUM.
#
#   sudo ./deploy/harden-vps.sh
#
# Le script est IDEMPOTENT : on peut le relancer sans dégât.
#
# ⚠ À exécuter APRÈS avoir vérifié que votre clé SSH fonctionne. Le script
# désactive l'authentification par mot de passe : si vous n'avez pas de clé
# en place, vous vous coupez l'accès au serveur. Le script refuse d'ailleurs
# de continuer s'il ne trouve aucune clé autorisée.
#
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Ce script doit être lancé avec sudo." >&2
  exit 1
fi

SSH_PORT="${SSH_PORT:-22}"
ADMIN_USER="${ADMIN_USER:-${SUDO_USER:-}}"

echo "=============================================="
echo " Durcissement VPS — PERFUMUM"
echo " utilisateur admin : ${ADMIN_USER:-<non défini>}"
echo " port SSH          : $SSH_PORT"
echo "=============================================="

# --- garde-fou : ne pas se verrouiller dehors ---------------------------------
KEYFILE=""
[[ -n "$ADMIN_USER" && -f "/home/$ADMIN_USER/.ssh/authorized_keys" ]] && KEYFILE="/home/$ADMIN_USER/.ssh/authorized_keys"
[[ -z "$KEYFILE" && -f /root/.ssh/authorized_keys ]] && KEYFILE=/root/.ssh/authorized_keys

if [[ -z "$KEYFILE" ]] || ! grep -qE '^(ssh-|ecdsa-|sk-)' "$KEYFILE" 2>/dev/null; then
  echo "❌ Aucune clé SSH autorisée trouvée." >&2
  echo "   Déposez d'abord votre clé publique (ssh-copy-id), sinon la" >&2
  echo "   désactivation des mots de passe vous couperait l'accès." >&2
  exit 1
fi
echo "✅ Clé SSH détectée dans $KEYFILE"

# --- mises à jour et paquets --------------------------------------------------
echo "▸ Installation des paquets…"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
  ufw fail2ban unattended-upgrades apt-listchanges \
  ca-certificates curl gnupg >/dev/null

# --- mises à jour de sécurité automatiques ------------------------------------
echo "▸ Mises à jour de sécurité automatiques…"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat > /etc/apt/apt.conf.d/51perfumum-unattended <<'EOF'
// Redémarrage automatique si un paquet l'exige, à une heure creuse.
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:30";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF

# --- SSH ----------------------------------------------------------------------
echo "▸ Durcissement SSH…"
cat > /etc/ssh/sshd_config.d/99-perfumum.conf <<EOF
Port $SSH_PORT
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
if sshd -t; then
  systemctl reload ssh 2>/dev/null || systemctl reload sshd
  echo "  ✅ configuration SSH rechargée"
else
  echo "  ❌ configuration SSH invalide, fichier retiré" >&2
  rm -f /etc/ssh/sshd_config.d/99-perfumum.conf
  exit 1
fi

# --- pare-feu -----------------------------------------------------------------
echo "▸ Pare-feu UFW…"
ufw --force reset >/dev/null
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw limit "$SSH_PORT"/tcp comment 'SSH (limité)' >/dev/null
ufw allow 80/tcp  comment 'HTTP (redirection + ACME)' >/dev/null
ufw allow 443/tcp comment 'HTTPS' >/dev/null
ufw allow 443/udp comment 'HTTP/3' >/dev/null
ufw --force enable >/dev/null
echo "  ✅ UFW actif"

# --- Docker contourne UFW : correctif -----------------------------------------
# Docker écrit ses propres règles dans la chaîne DOCKER-USER d'iptables, en
# amont d'UFW. Un port publié avec `ports:` devient donc accessible depuis
# Internet MÊME si UFW le bloque. C'est un piège classique et silencieux.
#
# Dans notre compose, seul Caddy publie des ports (80/443), qui sont de toute
# façon censés être publics. La règle ci-dessous est une ceinture de sécurité :
# si un service venait un jour à publier un port (une base, un tableau de
# bord…), il ne serait pas exposé par accident.
echo "▸ Restriction des ports publiés par Docker…"
cat > /etc/ufw/after.rules.d-perfumum <<'EOF'
# (référence conservée pour documentation)
EOF
if ! grep -q "PERFUMUM-DOCKER" /etc/ufw/after.rules; then
  cat >> /etc/ufw/after.rules <<'EOF'

# BEGIN PERFUMUM-DOCKER
# N'autoriser vers les conteneurs que 80/443 ; tout autre port publié est
# refusé, même si Docker l'a ouvert dans iptables.
*filter
:DOCKER-USER - [0:0]
-A DOCKER-USER -p tcp -m conntrack --ctorigdstport 80 -j RETURN
-A DOCKER-USER -p tcp -m conntrack --ctorigdstport 443 -j RETURN
-A DOCKER-USER -p udp -m conntrack --ctorigdstport 443 -j RETURN
-A DOCKER-USER -m conntrack --ctstate RELATED,ESTABLISHED -j RETURN
-A DOCKER-USER -i lo -j RETURN
-A DOCKER-USER -s 172.16.0.0/12 -j RETURN
-A DOCKER-USER -j DROP
COMMIT
# END PERFUMUM-DOCKER
EOF
  ufw reload >/dev/null
  echo "  ✅ chaîne DOCKER-USER restreinte à 80/443"
else
  echo "  ↷ règle déjà présente"
fi
rm -f /etc/ufw/after.rules.d-perfumum

# --- fail2ban -----------------------------------------------------------------
echo "▸ fail2ban…"
cat > /etc/fail2ban/jail.d/perfumum.conf <<EOF
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd
# Ne jamais se bannir soi-même depuis le réseau Docker ou la boucle locale.
ignoreip = 127.0.0.1/8 ::1 172.16.0.0/12

[sshd]
enabled  = true
port     = $SSH_PORT
maxretry = 3
bantime  = 24h

# Journaux d'accès de Caddy : bannit les scanners qui accumulent les 4xx.
# Le volume Docker de Caddy doit être monté pour que le chemin existe.
[caddy-status]
enabled  = false
port     = http,https
logpath  = /var/lib/docker/volumes/perfumum_caddy_data/_data/access.log
maxretry = 30
findtime = 5m
bantime  = 2h
EOF
systemctl enable fail2ban >/dev/null 2>&1 || true
systemctl restart fail2ban
echo "  ✅ fail2ban actif (prison sshd)"

# --- noyau --------------------------------------------------------------------
echo "▸ Paramètres noyau…"
cat > /etc/sysctl.d/99-perfumum.conf <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.tcp_syncookies = 1
kernel.dmesg_restrict = 1
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
EOF
sysctl -p /etc/sysctl.d/99-perfumum.conf >/dev/null
echo "  ✅ appliqué"

# --- swap : indispensable si le build tourne sur ce VPS -----------------------
# Le build du client atteint ~3,2 Go. Sur une machine de 4 Go où MySQL tourne
# déjà, le swap évite que le noyau tue le processus en cours de compilation.
if ! swapon --show | grep -q .; then
  echo "▸ Création d'un fichier d'échange de 2 Go…"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10 >/dev/null
  echo 'vm.swappiness = 10' > /etc/sysctl.d/99-swappiness.conf
  echo "  ✅ 2 Go de swap actifs"
else
  echo "  ↷ swap déjà configuré"
fi

echo
echo "=============================================="
echo " ✅ Durcissement terminé."
echo
echo " À VÉRIFIER MAINTENANT, sans fermer cette session :"
echo "   ouvrez un SECOND terminal et testez"
echo "     ssh -p $SSH_PORT ${ADMIN_USER:-utilisateur}@<ip-du-vps>"
echo "   Si la connexion échoue, corrigez depuis CETTE session,"
echo "   qui reste ouverte."
echo
echo " Contrôles utiles :"
echo "   ufw status verbose"
echo "   fail2ban-client status sshd"
echo "   swapon --show"
echo "=============================================="
