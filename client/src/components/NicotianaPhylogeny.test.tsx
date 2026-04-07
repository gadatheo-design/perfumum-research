import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NicotianaPhylogeny } from './NicotianaPhylogeny';
import { nicotianaPhylogeny, sourceMetadata } from '@/lib/nicotianaPhylogeny';

describe('NicotianaPhylogeny Component', () => {
  it('renders the component without crashing', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText('Phylogénie du Genre Nicotiana')).toBeInTheDocument();
  });

  it('displays the source citation correctly', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText(/Ludovica Santilli/)).toBeInTheDocument();
    expect(screen.getByText(/PhytoKeys/)).toBeInTheDocument();
    expect(screen.getByText(/2022/)).toBeInTheDocument();
  });

  it('displays key findings', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText(/Découvertes Principales/)).toBeInTheDocument();
    expect(screen.getByText(/new endemic species to Coquimbo, Chile/i)).toBeInTheDocument();
  });

  it('displays statistics correctly', () => {
    render(<NicotianaPhylogeny />);
    // Should display species count, sections count, and new species count
    expect(screen.getByText(/Espèces analysées/)).toBeInTheDocument();
    expect(screen.getByText(/Sections taxonomiques/)).toBeInTheDocument();
    expect(screen.getByText(/Nouvelles pour le Chili/)).toBeInTheDocument();
  });

  it('displays the phylogenetic tree root', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText(/Nicotiana L./)).toBeInTheDocument();
  });

  it('displays methods section', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText(/Méthodes Phylogénétiques/)).toBeInTheDocument();
    expect(screen.getByText(/trnF-trnL/)).toBeInTheDocument();
    expect(screen.getByText(/Maximum-likelihood/)).toBeInTheDocument();
  });

  it('displays legend information', () => {
    render(<NicotianaPhylogeny />);
    expect(screen.getByText(/Légende/)).toBeInTheDocument();
    expect(screen.getByText(/Nouvelle espèce/)).toBeInTheDocument();
    expect(screen.getByText(/Nouveau record pour le Chili/)).toBeInTheDocument();
  });

  it('has correct data structure for phylogenetic tree', () => {
    // Verify root node exists
    expect(nicotianaPhylogeny.id).toBe('nicotiana-root');
    expect(nicotianaPhylogeny.name).toBe('Nicotiana L.');
    expect(nicotianaPhylogeny.children).toBeDefined();
    expect(nicotianaPhylogeny.children!.length).toBeGreaterThan(0);
  });

  it('has correct source metadata', () => {
    expect(sourceMetadata.year).toBe(2022);
    expect(sourceMetadata.journal).toBe('PhytoKeys');
    expect(sourceMetadata.volume).toBe(188);
    expect(sourceMetadata.doi).toBe('10.3897/phytokeys.188.73370');
    expect(sourceMetadata.keyFindings.length).toBeGreaterThan(0);
  });

  it('contains Paniculatae section with key species', () => {
    const findSection = (node: any, id: string): any => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findSection(child, id);
          if (result) return result;
        }
      }
      return null;
    };

    const paniculatae = findSection(nicotianaPhylogeny, 'paniculatae');
    expect(paniculatae).toBeDefined();
    expect(paniculatae.section).toBe('Paniculatae');
    expect(paniculatae.notes).toContain('N. rupicola');
  });

  it('contains N. rupicola with correct conservation status', () => {
    const findSpecies = (node: any, id: string): any => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findSpecies(child, id);
          if (result) return result;
        }
      }
      return null;
    };

    const rupicola = findSpecies(nicotianaPhylogeny, 'n-rupicola');
    expect(rupicola).toBeDefined();
    expect(rupicola.conservationStatus).toBe('CR');
    expect(rupicola.notes).toContain('Critically endangered');
  });

  it('contains N. knightiana as new record for Chile', () => {
    const findSpecies = (node: any, id: string): any => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const result = findSpecies(child, id);
          if (result) return result;
        }
      }
      return null;
    };

    const knightiana = findSpecies(nicotianaPhylogeny, 'n-knightiana');
    expect(knightiana).toBeDefined();
    expect(knightiana.notes).toContain('First record for Chile');
  });
});
