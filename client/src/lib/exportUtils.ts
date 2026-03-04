// @ts-nocheck
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface MoleculeExportData {
  name: string;
  family: string | null;
  chemicalFormula: string | null;
  olfactiveProfile: string | null;
  emotionalResonance: string | null;
  functionalEffect: string | null;
  sourceOrigin: string | null;
  concentration: string | null;
  addedDate: string;
}

/**
 * Export molecules to CSV format
 */
export function exportToCSV(molecules: MoleculeExportData[], filename: string = "favoris-perfumum.csv") {
  // CSV headers
  const headers = [
    "Nom",
    "Famille Chimique",
    "Formule Chimique",
    "Profil Olfactif",
    "Résonance Émotionnelle",
    "Effet Fonctionnel",
    "Origine",
    "Concentration",
    "Date d'Ajout"
  ];

  // Convert molecules to CSV rows
  const rows = molecules.map(mol => [
    mol.name,
    mol.family || "",
    mol.chemicalFormula || "",
    mol.olfactiveProfile || "",
    mol.emotionalResonance || "",
    mol.functionalEffect || "",
    mol.sourceOrigin || "",
    mol.concentration || "",
    mol.addedDate
  ]);

  // Escape CSV fields (handle commas, quotes, newlines)
  const escapeCSV = (field: string) => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");

  // Create blob and download
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM for Excel UTF-8
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export molecules to PDF format
 */
export function exportToPDF(molecules: MoleculeExportData[], filename: string = "favoris-perfumum.pdf") {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PERFUMUM — Molécules Favorites", 14, 20);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  })}`, 14, 28);
  doc.text(`${molecules.length} molécule${molecules.length > 1 ? "s" : ""}`, 14, 34);

  let yPosition = 45;

  molecules.forEach((mol, index) => {
    // Check if we need a new page
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    // Molecule name (bold, larger)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(mol.name, 14, yPosition);
    yPosition += 7;

    // Family and formula on same line
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const metadata: string[] = [];
    if (mol.family) metadata.push(mol.family);
    if (mol.chemicalFormula) metadata.push(mol.chemicalFormula);
    if (metadata.length > 0) {
      doc.setTextColor(100, 100, 100);
      doc.text(metadata.join(" • "), 14, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 6;
    }

    // Olfactive profile
    if (mol.olfactiveProfile) {
      doc.setFont("helvetica", "bold");
      doc.text("Profil Olfactif:", 14, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      const profileLines = doc.splitTextToSize(mol.olfactiveProfile, 180);
      doc.text(profileLines, 14, yPosition);
      yPosition += profileLines.length * 5 + 3;
    }

    // Emotional resonance
    if (mol.emotionalResonance) {
      doc.setFont("helvetica", "bold");
      doc.text("Résonance Émotionnelle:", 14, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "italic");
      const resonanceLines = doc.splitTextToSize(mol.emotionalResonance, 180);
      doc.text(resonanceLines, 14, yPosition);
      yPosition += resonanceLines.length * 5 + 3;
      doc.setFont("helvetica", "normal");
    }

    // Functional effect
    if (mol.functionalEffect) {
      doc.setFont("helvetica", "bold");
      doc.text("Effet Fonctionnel:", 14, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      const effectLines = doc.splitTextToSize(mol.functionalEffect, 180);
      doc.text(effectLines, 14, yPosition);
      yPosition += effectLines.length * 5 + 3;
    }

    // Origin and concentration
    const details: string[] = [];
    if (mol.sourceOrigin) details.push(`Origine: ${mol.sourceOrigin}`);
    if (mol.concentration) details.push(`Concentration: ${mol.concentration}`);
    if (details.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(details.join(" • "), 14, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      yPosition += 5;
    }

    // Added date
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Ajouté le ${mol.addedDate}`, 14, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    yPosition += 3;

    // Separator line (except for last item)
    if (index < molecules.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPosition, 196, yPosition);
      yPosition += 8;
    }
  });

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `PERFUMUM — Recherche Olfactive • Page ${i}/${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  // Save PDF
  doc.save(filename);
}
