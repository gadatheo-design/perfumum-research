// @ts-nocheck
import { useState } from "react";

interface Philosopher {
  name: string;
  period: string;
  concept: string;
  description: string;
  color: string;
}

const philosophers: Philosopher[] = [
  {
    name: "Maurice Merleau-Ponty",
    period: "1945-1961",
    concept: "Phénoménologie de la perception",
    description: "L'odeur comme expérience corporelle immédiate, antérieure à toute conceptualisation. Le corps propre comme lieu d'émergence du sens olfactif.",
    color: "oklch(0.65 0.15 280)",
  },
  {
    name: "Gernot Böhme",
    period: "1995-2017",
    concept: "Théorie des atmosphères",
    description: "Les atmosphères comme espaces affectifs. L'odeur crée un climat, une ambiance qui enveloppe le sujet et transforme l'espace vécu.",
    color: "oklch(0.70 0.18 150)",
  },
  {
    name: "Jacques Derrida",
    period: "1967-2004",
    concept: "Archive et trace",
    description: "L'odeur comme trace mnésique, archive vivante du passé. La mémoire olfactive comme écriture non-linguistique du temps.",
    color: "oklch(0.60 0.20 60)",
  },
];

export function TimelinePhilosophique() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg border">
      <h3 className="text-xl font-bold mb-4 text-center">Timeline Philosophique</h3>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Évolution des concepts philosophiques appliqués à l'olfaction
      </p>

      {/* Timeline horizontale */}
      <div className="relative mb-8">
        {/* Ligne principale */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted-foreground/30 transform -translate-y-1/2" />

        {/* Points de la timeline */}
        <div className="relative flex justify-between items-center">
          {philosophers.map((philosopher, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
              style={{ width: "30%" }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              {/* Point */}
              <div
                className="w-6 h-6 rounded-full border-4 border-background transition-all duration-300 z-10"
                style={{
                  backgroundColor: philosopher.color,
                  transform: activeIndex === index ? "scale(1.5)" : "scale(1)",
                  boxShadow: activeIndex === index ? `0 0 20px ${philosopher.color}` : "none",
                }}
              />

              {/* Nom et période */}
              <div className="mt-4 text-center">
                <p className="text-sm font-bold">{philosopher.name}</p>
                <p className="text-xs text-muted-foreground">{philosopher.period}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description détaillée */}
      {activeIndex !== null && (
        <div
          className="p-6 rounded-lg animate-fadeIn"
          style={{
            backgroundColor: `color-mix(in oklch, ${philosophers[activeIndex].color} 15%, transparent)`,
            border: `2px solid ${philosophers[activeIndex].color}`,
          }}
        >
          <h4 className="text-lg font-bold mb-2" style={{ color: philosophers[activeIndex].color }}>
            {philosophers[activeIndex].concept}
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {philosophers[activeIndex].description}
          </p>
        </div>
      )}

      {/* Légende */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm">
        <p className="font-semibold mb-2">Parcours conceptuel :</p>
        <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
          <li>
            <strong>Merleau-Ponty</strong> : L'odeur comme expérience corporelle immédiate
          </li>
          <li>
            <strong>Böhme</strong> : L'odeur comme créatrice d'atmosphères spatiales
          </li>
          <li>
            <strong>Derrida</strong> : L'odeur comme archive et trace mémorielle
          </li>
        </ol>
      </div>
    </div>
  );
}
