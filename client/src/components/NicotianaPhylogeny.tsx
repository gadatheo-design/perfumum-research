import React, { useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, AlertTriangle, Leaf } from 'lucide-react';
import { nicotianaPhylogeny, sourceMetadata, type PhylogeneticNode } from '@/lib/nicotianaPhylogeny';

interface TreeNodeProps {
  node: PhylogeneticNode;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, isExpanded, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isNewSpecies = node.id === 'n-rupicola';
  const isNewRecord = node.id === 'n-knightiana';

  const getConservationColor = (status?: string) => {
    switch (status) {
      case 'CR': return 'bg-red-100 text-red-800 border-red-300';
      case 'EN': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'VU': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'NT': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LC': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSectionColor = (section?: string) => {
    const colors: Record<string, string> = {
      'Paniculatae': 'bg-purple-50 border-l-4 border-purple-500',
      'Suaveolentes': 'bg-blue-50 border-l-4 border-blue-500',
      'Tomentosae': 'bg-green-50 border-l-4 border-green-500',
      'Undulatae': 'bg-indigo-50 border-l-4 border-indigo-500',
      'Trigonophyllae': 'bg-pink-50 border-l-4 border-pink-500',
      'Petunioides': 'bg-cyan-50 border-l-4 border-cyan-500',
      'Alatae': 'bg-amber-50 border-l-4 border-amber-500',
      'Repandae': 'bg-lime-50 border-l-4 border-lime-500',
      'Noctiflorae': 'bg-slate-50 border-l-4 border-slate-500',
    };
    return colors[section || ''] || 'bg-white border-l-4 border-gray-300';
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-start gap-2 py-2 px-3 rounded-md transition-colors ${
          node.section ? getSectionColor(node.section) : 'hover:bg-gray-50'
        }`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => onToggle(node.id)}
            className="mt-0.5 p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              {isNewSpecies && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <Leaf className="w-3 h-3" /> NEW SPECIES
                </span>
              )}
              {isNewRecord && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  NEW RECORD
                </span>
              )}
            </div>

            <span className="font-semibold text-gray-900">{node.name}</span>

            {node.latinName && (
              <span className="text-sm italic text-gray-600">{node.latinName}</span>
            )}

            {node.conservationStatus && (
              <Badge className={`text-xs font-semibold ${getConservationColor(node.conservationStatus)}`}>
                {node.conservationStatus}
              </Badge>
            )}
          </div>

          {node.posteriorProbability !== undefined && (
            <div className="text-xs text-gray-600 mt-1">
              <span>PP: {node.posteriorProbability.toFixed(2)}</span>
              {node.bootstrapValue !== undefined && (
                <span> | BS: {node.bootstrapValue}</span>
              )}
            </div>
          )}

          {node.notes && (
            <p className="text-sm text-gray-700 mt-1 leading-snug">{node.notes}</p>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={true}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const NicotianaPhylogeny: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    new Set(['nicotiana-root', 'undulatae-paniculatae-clade', 'paniculatae-rest-clade', 'paniculatae'])
  );

  const handleToggle = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    let totalSpecies = 0;
    let totalSections = 0;
    const sectionMap = new Map<string, number>();

    const countNodes = (node: PhylogeneticNode) => {
      if (node.latinName && node.latinName.startsWith('N.')) {
        totalSpecies++;
      }
      if (node.section && node.section.match(/^[A-Z]/)) {
        if (!sectionMap.has(node.section)) {
          sectionMap.set(node.section, 0);
          totalSections++;
        }
        sectionMap.set(node.section, (sectionMap.get(node.section) || 0) + 1);
      }
      if (node.children) {
        node.children.forEach(countNodes);
      }
    };

    countNodes(nicotianaPhylogeny);
    return { totalSpecies, totalSections, sectionMap };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Phylogénie du Genre Nicotiana</h1>
        <p className="text-gray-600">
          Arbre phylogénétique complet basé sur l'analyse moléculaire de 60 espèces
        </p>
      </div>

      {/* Source Citation */}
      <Card className="bg-blue-50 border-blue-200 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-blue-900">Source Scientifique</h3>
          <p className="text-sm text-blue-800">
            <strong>{sourceMetadata.authors}</strong> ({sourceMetadata.year})
          </p>
          <p className="text-sm text-blue-800">
            {sourceMetadata.title}
          </p>
          <p className="text-sm text-blue-700">
            <em>{sourceMetadata.journal}</em> {sourceMetadata.volume}: {sourceMetadata.pages}
          </p>
          <p className="text-xs text-blue-600">
            DOI: <a href={`https://doi.org/${sourceMetadata.doi}`} className="underline hover:text-blue-800">
              {sourceMetadata.doi}
            </a>
          </p>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalSpecies}</div>
            <div className="text-sm text-gray-600">Espèces analysées</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalSections}</div>
            <div className="text-sm text-gray-600">Sections taxonomiques</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Nouvelles pour le Chili</div>
          </div>
        </Card>
      </div>

      {/* Key Findings */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900">Découvertes Principales</h3>
              <ul className="text-sm text-yellow-800 space-y-1 mt-2">
                {sourceMetadata.keyFindings.map((finding, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Phylogenetic Tree */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Arbre Phylogénétique Interactif</h2>
        <div className="space-y-1 font-mono text-sm">
          <TreeNode
            node={nicotianaPhylogeny}
            level={0}
            isExpanded={expandedNodes.has('nicotiana-root')}
            onToggle={handleToggle}
          />
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Nouvelle espèce (N. rupicola)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Nouveau record pour le Chili (N. knightiana)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">CR</Badge>
              <span>En danger critique (Critically Endangered)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-700">
              <strong>PP:</strong> Probabilité postérieure Bayésienne (0-1)
            </div>
            <div className="text-gray-700">
              <strong>BS:</strong> Valeur de bootstrap ML (0-100)
            </div>
            <div className="text-gray-700">
              Les sections taxonomiques sont colorées pour faciliter la navigation
            </div>
          </div>
        </div>
      </Card>

      {/* Methods */}
      <Card className="p-4 bg-slate-50">
        <h3 className="font-semibold text-gray-900 mb-2">Méthodes Phylogénétiques</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Régions ADN:</strong> {sourceMetadata.phylogeneticMethods.dnaRegions.join(', ')}</p>
          <p><strong>Analyses:</strong> {sourceMetadata.phylogeneticMethods.analyses.join(', ')}</p>
          <p><strong>Logiciels:</strong> {sourceMetadata.phylogeneticMethods.software.join(', ')}</p>
          <p><strong>Séquences totales:</strong> {sourceMetadata.phylogeneticMethods.totalSequences} nucléotides</p>
          <p><strong>Accessions:</strong> {sourceMetadata.phylogeneticMethods.inGroupAccessions} ingroup + {sourceMetadata.phylogeneticMethods.outGroupAccessions} outgroup</p>
        </div>
      </Card>
    </div>
  );
};

export default NicotianaPhylogeny;
