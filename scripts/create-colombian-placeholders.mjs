import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colombianMolecules = [
  { id: 'lippia-origanoides', name: 'Lippia Origanoides', color: '#2d5016' },
  { id: 'turnera-diffusa', name: 'Turnera Diffusa', color: '#8b6914' },
  { id: 'calycolpus-moritzianus', name: 'Calycolpus Moritzianus', color: '#1a3a1a' },
  { id: 'piper-aduncum', name: 'Piper Aduncum', color: '#3d2817' },
  { id: 'steiractinia-aspera', name: 'Steiractinia Aspera', color: '#5a4a3a' },
  { id: 'cafe-geisha', name: 'Café Geisha', color: '#6b4423' },
  { id: 'fleur-cafe', name: 'Fleur de Café', color: '#c4a57b' },
  { id: 'cacao-colombien', name: 'Cacao Colombien', color: '#5a3a1a' },
  { id: 'palo-santo', name: 'Palo Santo', color: '#8b7355' },
];

const publicDir = path.join(__dirname, '../client/public/colombian-botanicals');

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

colombianMolecules.forEach((molecule) => {
  const svgContent = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${molecule.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${molecule.color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#grad-${molecule.id})"/>
  <circle cx="128" cy="128" r="80" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3"/>
  <text x="128" y="140" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" opacity="0.7">
    ${molecule.name}
  </text>
  <text x="128" y="160" font-family="Arial, sans-serif" font-size="10" fill="#ffffff" text-anchor="middle" opacity="0.5">
    Colombie
  </text>
</svg>`;

  const outputPath = path.join(publicDir, `${molecule.id}.svg`);
  fs.writeFileSync(outputPath, svgContent);
  console.log(`✅ Created placeholder: ${molecule.id}.svg`);
});

console.log('✅ All Colombian botanical placeholders created!');
