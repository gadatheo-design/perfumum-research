import { describe, it, expect } from 'vitest';

// Test the historic cigarettes API endpoint
describe('research.getHistoricCigarettes', () => {
  it('should return an array of historic cigarettes', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/research.getHistoricCigarettes');
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.data).toBeDefined();
    
    const cigarettes = data.result.data.json;
    expect(Array.isArray(cigarettes)).toBe(true);
    expect(cigarettes.length).toBeGreaterThan(0);
  });

  it('should return at least 10 historic cigarettes', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/research.getHistoricCigarettes');
    const data = await response.json();
    
    const cigarettes = data.result.data.json;
    expect(cigarettes.length).toBeGreaterThanOrEqual(10);
  });
});

describe('research.getPeriqueMoleculeLinks', () => {
  it('should return an array of Perique-molecule links', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/research.getPeriqueMoleculeLinks');
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.data).toBeDefined();
    
    const links = data.result.data.json;
    expect(Array.isArray(links)).toBe(true);
  });

  it('should return Perique-molecule links with enriched data', async () => {
    const response = await fetch('http://localhost:3000/api/trpc/research.getPeriqueMoleculeLinks');
    const data = await response.json();
    
    const links = data.result.data.json;
    expect(links.length).toBeGreaterThan(0);
  });
});
