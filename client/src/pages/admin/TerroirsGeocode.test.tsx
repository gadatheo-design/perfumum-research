import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TerroirsGeocode from './TerroirsGeocode';

// Mock trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    geographicOrigins: {
      list: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              name: 'Terroir A',
              country: 'France',
              region: 'Provence',
              latitude: 43.9352,
              longitude: 6.6245
            },
            {
              id: '2',
              name: 'Terroir B',
              country: 'Suisse',
              region: 'Valais',
              latitude: null,
              longitude: null
            }
          ],
          isLoading: false,
          refetch: vi.fn()
        })
      },
      geocode: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false
        })
      },
      geocodeBatch: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false
        })
      }
    }
  }
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('TerroirsGeocode Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without errors', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText(/Géocodage des Terroirs/i)).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText('Terroirs total')).toBeInTheDocument();
    expect(screen.getByText('Géocodés')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<TerroirsGeocode />);
    const searchInput = screen.getByPlaceholderText(/Rechercher un terroir/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays terroir cards', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText('Terroir A')).toBeInTheDocument();
    expect(screen.getByText('Terroir B')).toBeInTheDocument();
  });

  it('displays geocoding status badges', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText('Géocodé')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  it('displays coordinates for geocoded terroirs', () => {
    render(<TerroirsGeocode />);
    // Check that coordinates are displayed in the correct format
    const coordText = screen.getByText(/43\.9352/);
    expect(coordText).toBeInTheDocument();
  });

  it('displays batch geocode button', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText(/Géocoder tout/i)).toBeInTheDocument();
  });

  it('displays progress bar', () => {
    render(<TerroirsGeocode />);
    expect(screen.getByText(/Progression du géocodage/i)).toBeInTheDocument();
  });
});
