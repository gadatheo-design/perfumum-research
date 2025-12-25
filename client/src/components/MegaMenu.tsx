import { Link } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Beaker,
  FlaskConical,
  Network,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Leaf,
  Settings,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
  count?: number;
}

interface MegaMenuSection {
  title: string;
  items: MenuItem[];
}

interface MegaMenuProps {
  trigger: string;
  sections: MegaMenuSection[];
}

function MegaMenuDropdown({ trigger, sections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Flatten all items for keyboard navigation
  const allItems = sections.flatMap(section => section.items);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => (prev + 1) % allItems.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  }, [isOpen, allItems.length]);

  // Focus item when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Track item index across sections
  let itemIndex = 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setFocusedIndex(-1);
      }}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
          role="menu"
          aria-label={trigger}
        >
          <div className="bg-background border rounded-lg shadow-xl p-6 min-w-[600px]">
            <div className="grid grid-cols-3 gap-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} role="group" aria-labelledby={`section-${sectionIndex}`}>
                  <h3 
                    id={`section-${sectionIndex}`}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const currentIndex = itemIndex++;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          ref={(el) => { itemsRef.current[currentIndex] = el; }}
                          onClick={() => {
                            setIsOpen(false);
                            setFocusedIndex(-1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsOpen(false);
                              setFocusedIndex(-1);
                              triggerRef.current?.focus();
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setFocusedIndex((currentIndex + 1) % allItems.length);
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setFocusedIndex((currentIndex - 1 + allItems.length) % allItems.length);
                            }
                          }}
                          className={cn(
                            "flex items-start gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-muted"
                          )}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                        >
                          {item.icon && (
                            <div className="text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">
                              {item.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.count !== undefined && (
                                <span className="text-xs text-muted-foreground">({item.count})</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MegaMenu() {
  // === RECHERCHE (5 liens essentiels) ===
  const rechercheSections: MegaMenuSection[] = [
    {
      title: "Base de données",
      items: [
        {
          label: "Molécules",
          path: "/molecules",
          icon: <Beaker className="h-4 w-4" />,
          description: "288 molécules documentées",
          count: 288,
        },
        {
          label: "Recettes",
          path: "/recettes",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "234 formules olfactives",
          count: 234,
        },
        {
          label: "Gammes",
          path: "/gammes",
          icon: <Sparkles className="h-4 w-4" />,
          description: "8 gammes thématiques",
        },
      ],
    },
    {
      title: "Outils",
      items: [
        {
          label: "Synergies",
          path: "/suggestions-synergies",
          icon: <Network className="h-4 w-4" />,
          description: "Suggestions IA basées radar",
        },
        {
          label: "Calculateur",
          path: "/calculateur",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Formulation terpénique",
        },
      ],
    },
    {
      title: "Projet",
      items: [
        {
          label: "Manifeste",
          path: "/manifeste",
          icon: <Target className="h-4 w-4" />,
          description: "Vision ABSORBE 2025-2035",
        },
      ],
    },
  ];

  // === MÉTHODOLOGIE (5 liens essentiels) ===
  const methodologieSections: MegaMenuSection[] = [
    {
      title: "ABSORBE",
      items: [
        {
          label: "Méthode ABSORBE",
          path: "/methodologie/absorbe",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Captation atmosphérique",
        },
        {
          label: "Échelle ABSORBE",
          path: "/methodologie/echelle",
          icon: <Leaf className="h-4 w-4" />,
          description: "Système de classification",
        },
      ],
    },
    {
      title: "Techniques",
      items: [
        {
          label: "GC-MS",
          path: "/methodologie/gcms",
          icon: <Beaker className="h-4 w-4" />,
          description: "Chromatographie gazeuse",
        },
        {
          label: "Pyrolyse",
          path: "/methodologie/pyrolyse",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Analyse thermique",
        },
      ],
    },
    {
      title: "Recherche",
      items: [
        {
          label: "Fondements",
          path: "/recherche/fondements-theoriques",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Phénoménologie olfactive",
        },
      ],
    },
  ];

  // === COMMUNAUTÉ (5 liens essentiels) ===
  const communauteSections: MegaMenuSection[] = [
    {
      title: "Projet",
      items: [
        {
          label: "À propos",
          path: "/a-propos",
          icon: <Users className="h-4 w-4" />,
          description: "Histoire et équipe",
        },
        {
          label: "Contribuer",
          path: "/contribuer",
          icon: <Target className="h-4 w-4" />,
          description: "Rejoindre le projet",
        },
      ],
    },
    {
      title: "Ressources",
      items: [
        {
          label: "Timeline",
          path: "/timeline",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Chronologie recherche",
        },
        {
          label: "Glossaire",
          path: "/glossaire",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Terminologie olfactive",
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          label: "Administration",
          path: "/admin",
          icon: <Settings className="h-4 w-4" />,
          description: "Gestion du site",
        },
      ],
    },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
      <MegaMenuDropdown trigger="Recherche" sections={rechercheSections} />
      <MegaMenuDropdown trigger="Méthodologie" sections={methodologieSections} />
      <MegaMenuDropdown trigger="Communauté" sections={communauteSections} />
    </nav>
  );
}
