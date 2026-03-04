// @ts-nocheck
import { Link } from "wouter";

/**
 * Converts a comma-separated list of molecule names into clickable links
 * Example: "géosmine, spikenard, vétiver humide" → links to /molecule/:id
 */
export function linkifyMoleculeNames(
  text: string,
  molecules: Array<{ id: number; name: string }> | undefined
): React.ReactNode {
  if (!molecules || molecules.length === 0) {
    return text;
  }

  // Split by comma
  const parts = text.split(",").map(p => p.trim());

  return parts.map((part, index) => {
    // Try to find a molecule that matches this part (case-insensitive, partial match)
    const matchedMolecule = molecules.find(m => 
      part.toLowerCase().includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(part.toLowerCase())
    );

    if (matchedMolecule) {
      return (
        <span key={index}>
          <Link 
            href={`/molecule/${matchedMolecule.id}`}
            className="text-primary hover:underline hover:text-primary/80 transition-colors font-medium"
          >
            {part}
          </Link>
          {index < parts.length - 1 && ", "}
        </span>
      );
    }

    return (
      <span key={index}>
        {part}
        {index < parts.length - 1 && ", "}
      </span>
    );
  });
}
