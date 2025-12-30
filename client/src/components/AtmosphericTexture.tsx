interface AtmosphericTextureProps {
  type: "petrichor" | "volcanique" | "glaciaire" | "biolab";
  className?: string;
}

export function AtmosphericTexture({ type, className = "" }: AtmosphericTextureProps) {
  const textures = {
    petrichor: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="petrichor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "oklch(0.40 0.08 220)", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "oklch(0.35 0.06 200)", stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: "oklch(0.30 0.04 240)", stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        {/* Texture terre humide */}
        <rect width="800" height="400" fill="url(#petrichor-gradient)" />
        <rect width="800" height="400" fill="url(#petrichor-gradient)" filter="url(#noise)" opacity="0.4" />
        {/* Gouttes de pluie */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 800}
            cy={Math.random() * 400}
            r={Math.random() * 3 + 1}
            fill="oklch(0.60 0.10 220)"
            opacity={Math.random() * 0.3 + 0.1}
          />
        ))}
      </svg>
    ),
    volcanique: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="volcanique-gradient">
            <stop offset="0%" style={{ stopColor: "oklch(0.45 0.15 40)", stopOpacity: 0.6 }} />
            <stop offset="70%" style={{ stopColor: "oklch(0.30 0.10 20)", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "oklch(0.20 0.05 10)", stopOpacity: 0.2 }} />
          </radialGradient>
          <filter id="smoke">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="2"/>
            <feDisplacementMap in="SourceGraphic" scale="50"/>
          </filter>
        </defs>
        {/* Fumée volcanique */}
        <rect width="800" height="400" fill="url(#volcanique-gradient)" />
        {/* Particules de cendre */}
        {[...Array(50)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 800}
            cy={Math.random() * 400}
            r={Math.random() * 2 + 0.5}
            fill="oklch(0.50 0.05 30)"
            opacity={Math.random() * 0.4 + 0.1}
          />
        ))}
        {/* Lignes de fumée */}
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M ${i * 100} 400 Q ${i * 100 + 50} ${300 - i * 20} ${i * 100} 200`}
            stroke="oklch(0.40 0.08 20)"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
            filter="url(#smoke)"
          />
        ))}
      </svg>
    ),
    glaciaire: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glaciaire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "oklch(0.70 0.08 240)", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "oklch(0.80 0.06 220)", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "oklch(0.75 0.04 260)", stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="frost">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/>
            <feColorMatrix type="saturate" values="0.3"/>
          </filter>
        </defs>
        {/* Texture glace */}
        <rect width="800" height="400" fill="url(#glaciaire-gradient)" />
        <rect width="800" height="400" fill="url(#glaciaire-gradient)" filter="url(#frost)" opacity="0.3" />
        {/* Cristaux de glace */}
        {[...Array(40)].map((_, i) => {
          const x = Math.random() * 800;
          const y = Math.random() * 400;
          const size = Math.random() * 4 + 2;
          return (
            <g key={i} opacity={Math.random() * 0.4 + 0.2}>
              <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="oklch(0.85 0.05 240)" strokeWidth="0.5" />
              <line x1={x - size} y1={y} x2={x + size} y2={y} stroke="oklch(0.85 0.05 240)" strokeWidth="0.5" />
              <line x1={x - size * 0.7} y1={y - size * 0.7} x2={x + size * 0.7} y2={y + size * 0.7} stroke="oklch(0.85 0.05 240)" strokeWidth="0.5" />
              <line x1={x - size * 0.7} y1={y + size * 0.7} x2={x + size * 0.7} y2={y - size * 0.7} stroke="oklch(0.85 0.05 240)" strokeWidth="0.5" />
            </g>
          );
        })}
      </svg>
    ),
    biolab: (
      <svg className={`w-full h-full ${className}`} viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="biolab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "oklch(0.60 0.12 330)", stopOpacity: 0.2 }} />
            <stop offset="50%" style={{ stopColor: "oklch(0.55 0.10 340)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "oklch(0.50 0.08 320)", stopOpacity: 0.2 }} />
          </linearGradient>
          <filter id="organic">
            <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2"/>
            <feColorMatrix type="saturate" values="0.5"/>
          </filter>
        </defs>
        {/* Texture organique */}
        <rect width="800" height="400" fill="url(#biolab-gradient)" />
        <rect width="800" height="400" fill="url(#biolab-gradient)" filter="url(#organic)" opacity="0.3" />
        {/* Cellules/bulles */}
        {[...Array(25)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 800}
            cy={Math.random() * 400}
            r={Math.random() * 15 + 5}
            fill="none"
            stroke="oklch(0.65 0.10 330)"
            strokeWidth="1"
            opacity={Math.random() * 0.3 + 0.1}
          />
        ))}
        {/* Connexions moléculaires */}
        {[...Array(15)].map((_, i) => {
          const x1 = Math.random() * 800;
          const y1 = Math.random() * 400;
          const x2 = x1 + (Math.random() - 0.5) * 100;
          const y2 = y1 + (Math.random() - 0.5) * 100;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="oklch(0.60 0.08 330)"
              strokeWidth="0.5"
              opacity="0.2"
            />
          );
        })}
      </svg>
    ),
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {textures[type]}
    </div>
  );
}
