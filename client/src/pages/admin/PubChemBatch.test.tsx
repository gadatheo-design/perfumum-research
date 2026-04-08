import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PubChemBatch from './PubChemBatch';

// Mock trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    molecules: {
      getEnrichmentStats: {
        useQuery: () => ({
          data: {
            total: 100,
            enriched: 60,
            unenriched: 40
          },
          refetch: vi.fn()
        })
      },
      getUnenriched: {
        useQuery: () => ({
          data: [],
          refetch: vi.fn().mockResolvedValue({ data: [] })
        })
      },
      enrichFromPubChem: {
        useMutation: () => ({
          mutateAsync: vi.fn()
        })
      }
    }
  }
}));

describe('PubChemBatch Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without errors', () => {
    render(<PubChemBatch />);
    expect(screen.getByText(/Enrichissement PubChem/i)).toBeInTheDocument();
  });

  it('displays enrichment statistics', () => {
    render(<PubChemBatch />);
    expect(screen.getByText('Total molécules')).toBeInTheDocument();
    expect(screen.getByText('Enrichies (PubChem)')).toBeInTheDocument();
    expect(screen.getByText('Sans CID (à enrichir)')).toBeInTheDocument();
  });

  it('displays batch configuration options', () => {
    render(<PubChemBatch />);
    expect(screen.getByText(/Configuration du batch/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de molécules à traiter/i)).toBeInTheDocument();
    expect(screen.getByText(/Délai entre requêtes/i)).toBeInTheDocument();
  });

  it('displays control buttons', () => {
    render(<PubChemBatch />);
    expect(screen.getByText(/Démarrer/i)).toBeInTheDocument();
  });

  it('displays batch size options', () => {
    render(<PubChemBatch />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.textContent === '50')).toBe(true);
    expect(buttons.some(btn => btn.textContent === '100')).toBe(true);
  });

  it('displays delay options', () => {
    render(<PubChemBatch />);
    expect(screen.getByText('1200ms')).toBeInTheDocument();
    expect(screen.getByText('2000ms')).toBeInTheDocument();
  });

  it('renders the back to admin button', () => {
    render(<PubChemBatch />);
    const adminLink = screen.getByText('Admin');
    expect(adminLink).toBeInTheDocument();
  });
});
