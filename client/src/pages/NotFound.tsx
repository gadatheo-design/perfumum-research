import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Home,
  Leaf,
  FlaskConical,
  BookOpen,
  TreeDeciduous,
  Search,
  ArrowRight,
} from "lucide-react";

const ENTRY_POINTS = [
  {
    href: "/",
    icon: <Home className="h-4 w-4" />,
    label: "Accueil",
    desc: "Le manifeste PERFUMUM",
  },
  {
    href: "/plantes",
    icon: <Leaf className="h-4 w-4" />,
    label: "Matières premières",
    desc: "Base de données botanique",
  },
  {
    href: "/molecules",
    icon: <FlaskConical className="h-4 w-4" />,
    label: "Molécules",
    desc: "Cartographie moléculaire",
  },
  {
    href: "/phylogenetique",
    icon: <TreeDeciduous className="h-4 w-4" />,
    label: "Phylogénétique",
    desc: "Arbres et classifications",
  },
  {
    href: "/recettes",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Recettes",
    desc: "Formulations olfactives",
  },
];

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation de particules légère
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 80, 200, ${p.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Canvas de particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenu principal */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Numéro 404 stylisé */}
        <div className="relative">
          <p
            className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter select-none"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </p>
        </div>

        {/* Texte narratif */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cette page s'est évaporée
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Comme une molécule volatile au contact de l'air, cette page n'existe plus —
            ou n'a jamais existé. Le chemin olfactif que vous cherchez s'est dissous
            dans l'atlas. Choisissez une autre porte d'entrée.
          </p>
        </div>

        {/* 5 points d'entrée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {ENTRY_POINTS.map(({ href, icon, label, desc }) => (
            <Link key={href} href={href}>
              <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/20 transition-colors">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">{desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 ml-auto flex-shrink-0 group-hover:text-primary/70 transition-all" />
              </div>
            </Link>
          ))}

          {/* Bouton recherche globale */}
          <div
            className="group flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-accent/50 transition-all cursor-pointer sm:col-span-2 lg:col-span-1"
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
              document.dispatchEvent(event);
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/20 transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold group-hover:text-primary transition-colors">Recherche globale</p>
              <p className="text-xs text-muted-foreground">Cmd+K · Trouver n'importe quoi</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 ml-auto flex-shrink-0 group-hover:text-primary/70 transition-all" />
          </div>
        </div>

        {/* Lien retour */}
        <div className="pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>

      {/* Signature discrète */}
      <p className="absolute bottom-6 text-xs text-muted-foreground/40 font-mono tracking-widest">
        PERFUMUM — ATLAS OLFACTIF
      </p>
    </div>
  );
}
