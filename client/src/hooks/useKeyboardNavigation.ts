import { useEffect } from "react";
import { useLocation } from "wouter";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardNavigation() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      // Navigation rapide (G + lettre)
      {
        key: "g",
        description: "Mode navigation (appuyez ensuite sur T/R/G/M)",
        action: () => {
          // Active le mode "go to"
          const handleSecondKey = (e: KeyboardEvent) => {
            switch (e.key.toLowerCase()) {
              case "t":
                setLocation("/terpenes");
                break;
              case "r":
                setLocation("/resines-cbd");
                break;
              case "g":
                setLocation("/graphe-molecules-recettes");
                break;
              case "m":
                setLocation("/matrice-synergies");
                break;
              case "h":
                setLocation("/");
                break;
              case "a":
                setLocation("/admin");
                break;
            }
            window.removeEventListener("keydown", handleSecondKey);
          };
          
          window.addEventListener("keydown", handleSecondKey);
          
          // Timeout pour annuler le mode après 2 secondes
          setTimeout(() => {
            window.removeEventListener("keydown", handleSecondKey);
          }, 2000);
        },
      },
      // Recherche globale
      {
        key: "/",
        description: "Ouvrir la recherche",
        action: () => {
          const event = new CustomEvent("open-global-search");
          window.dispatchEvent(event);
        },
      },
      {
        key: "k",
        ctrlKey: true,
        description: "Ouvrir la recherche (Ctrl+K)",
        action: () => {
          const event = new CustomEvent("open-global-search");
          window.dispatchEvent(event);
        },
      },
      {
        key: "k",
        metaKey: true,
        description: "Ouvrir la recherche (⌘K)",
        action: () => {
          const event = new CustomEvent("open-global-search");
          window.dispatchEvent(event);
        },
      },
      // Historique
      {
        key: "h",
        ctrlKey: true,
        description: "Ouvrir l'historique (Ctrl+H)",
        action: () => {
          const event = new CustomEvent("open-navigation-history");
          window.dispatchEvent(event);
        },
      },
      {
        key: "h",
        metaKey: true,
        description: "Ouvrir l'historique (⌘H)",
        action: () => {
          const event = new CustomEvent("open-navigation-history");
          window.dispatchEvent(event);
        },
      },
      // Échap pour fermer overlays
      {
        key: "Escape",
        description: "Fermer les overlays",
        action: () => {
          const event = new CustomEvent("close-overlays");
          window.dispatchEvent(event);
        },
      },
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Exception pour "/" et Échap qui fonctionnent partout
        if (e.key !== "/" && e.key !== "Escape") {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey;
        const metaMatch = shortcut.metaKey ? e.metaKey : !e.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setLocation]);

  return {
    shortcuts: [
      { keys: ["G", "T"], description: "Aller aux Terpènes" },
      { keys: ["G", "R"], description: "Aller aux Résines CBD" },
      { keys: ["G", "G"], description: "Aller au Graphe" },
      { keys: ["G", "M"], description: "Aller à la Matrice synergies" },
      { keys: ["G", "H"], description: "Aller à l'Accueil" },
      { keys: ["G", "A"], description: "Aller à l'Admin" },
      { keys: ["/"], description: "Ouvrir la recherche" },
      { keys: ["⌘", "K"], description: "Ouvrir la recherche (Mac)" },
      { keys: ["Ctrl", "K"], description: "Ouvrir la recherche (Windows)" },
      { keys: ["⌘", "H"], description: "Ouvrir l'historique (Mac)" },
      { keys: ["Ctrl", "H"], description: "Ouvrir l'historique (Windows)" },
      { keys: ["Échap"], description: "Fermer les overlays" },
    ],
  };
}
