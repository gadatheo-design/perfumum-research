// @ts-nocheck
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  sections: Array<{
    heading: string;
    content: string | string[];
  }>;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string;
  };
  pageUrl?: string; // URL for QR code
  citationStyle?: "APA" | "MLA" | "Chicago";
}

/**
 * Generate a professional PDF document with QR code and citations
 */
export async function generatePDF(options: PDFExportOptions): Promise<void> {
  const {
    title,
    subtitle,
    sections,
    metadata,
    pageUrl,
    citationStyle = "APA",
  } = options;

  // Create PDF document (A4 size)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set metadata
  if (metadata) {
    pdf.setProperties({
      title: title,
      subject: metadata.subject || title,
      author: metadata.author || "PERFUMUM Research",
      keywords: metadata.keywords || "",
      creator: "PERFUMUM Platform",
    });
  }

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header: PERFUMUM logo/brand
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text("PERFUMUM — Recherche Olfactive", margin, yPosition);
  yPosition += 5;
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10 + 5;

  // Subtitle
  if (subtitle) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    const subtitleLines = pdf.splitTextToSize(subtitle, contentWidth);
    pdf.text(subtitleLines, margin, yPosition);
    yPosition += subtitleLines.length * 7 + 10;
  }

  // Sections
  for (const section of sections) {
    checkNewPage(20);

    // Section heading
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(section.heading, margin, yPosition);
    yPosition += 10;

    // Section content
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(40, 40, 40);

    if (Array.isArray(section.content)) {
      // Bullet list
      for (const item of section.content) {
        checkNewPage(10);
        const itemLines = pdf.splitTextToSize(`• ${item}`, contentWidth - 5);
        pdf.text(itemLines, margin + 5, yPosition);
        yPosition += itemLines.length * 6 + 2;
      }
    } else {
      // Paragraph
      const contentLines = pdf.splitTextToSize(section.content, contentWidth);
      for (const line of contentLines) {
        checkNewPage(6);
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      }
    }

    yPosition += 8;
  }

  // QR Code (if URL provided)
  if (pageUrl) {
    checkNewPage(60);

    // Generate QR code as data URL
    try {
      const qrDataUrl = await QRCode.toDataURL(pageUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Add QR code section
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Accès en ligne", margin, yPosition);
      yPosition += 8;

      // Add QR code image
      pdf.addImage(qrDataUrl, "PNG", margin, yPosition, 40, 40);

      // Add URL text next to QR code
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const urlLines = pdf.splitTextToSize(pageUrl, contentWidth - 50);
      pdf.text(urlLines, margin + 45, yPosition + 5);

      yPosition += 50;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  }

  // Citation
  checkNewPage(30);
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Citation recommandée", margin, yPosition);
  yPosition += 7;

  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(80, 80, 80);
  const citation = generateCitation(title, citationStyle, pageUrl);
  const citationLines = pdf.splitTextToSize(citation, contentWidth);
  pdf.text(citationLines, margin, yPosition);
  yPosition += citationLines.length * 5 + 10;

  // Footer on last page
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  const footerText = `Généré le ${new Date().toLocaleDateString("fr-FR")} par PERFUMUM Platform`;
  pdf.text(footerText, margin, pageHeight - 10);

  // Page numbers on all pages
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Page ${i} / ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
  }

  // Save PDF
  const filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
  pdf.save(filename);
}

/**
 * Generate citation in specified style
 */
function generateCitation(
  title: string,
  style: "APA" | "MLA" | "Chicago",
  url?: string
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const day = date.getDate();

  switch (style) {
    case "APA":
      return `PERFUMUM Research. (${year}). ${title}. ${url ? `Consulté le ${day} ${month} ${year}, à l'adresse ${url}` : ""}`;

    case "MLA":
      return `"${title}." PERFUMUM Research, ${year}${url ? `, ${url}. Consulté le ${day} ${month} ${year}` : ""}.`;

    case "Chicago":
      return `PERFUMUM Research. "${title}." ${year}${url ? `. ${url} (consulté le ${day} ${month} ${year})` : ""}.`;

    default:
      return `PERFUMUM Research. ${title}. ${year}.`;
  }
}

/**
 * Export molecule data to PDF
 */
export async function exportMoleculePDF(molecule: {
  name: string;
  chemicalFormula?: string;
  olfactiveProfile?: string;
  family?: string;
  description?: string;
  id: number;
}): Promise<void> {
  const sections: PDFExportOptions["sections"] = [];

  if (molecule.chemicalFormula) {
    sections.push({
      heading: "Formule chimique",
      content: molecule.chemicalFormula,
    });
  }

  if (molecule.family) {
    sections.push({
      heading: "Famille olfactive",
      content: molecule.family,
    });
  }

  if (molecule.olfactiveProfile) {
    sections.push({
      heading: "Profil olfactif",
      content: molecule.olfactiveProfile,
    });
  }

  if (molecule.description) {
    sections.push({
      heading: "Description",
      content: molecule.description,
    });
  }

  await generatePDF({
    title: molecule.name,
    subtitle: "Fiche Molécule",
    sections,
    metadata: {
      subject: `Fiche technique - ${molecule.name}`,
      keywords: `molécule, ${molecule.family || ""}, parfumerie`,
    },
    pageUrl: `${window.location.origin}/molecules/${molecule.id}`,
    citationStyle: "APA",
  });
}

/**
 * Export recipe data to PDF
 */
export async function exportRecipePDF(recipe: {
  name: string;
  category?: string;
  composition?: string;
  notes?: string;
  description?: string;
  id: number;
}): Promise<void> {
  const sections: PDFExportOptions["sections"] = [];

  if (recipe.category) {
    sections.push({
      heading: "Catégorie",
      content: recipe.category,
    });
  }

  if (recipe.description) {
    sections.push({
      heading: "Description",
      content: recipe.description,
    });
  }

  if (recipe.composition) {
    sections.push({
      heading: "Composition",
      content: recipe.composition,
    });
  }

  if (recipe.notes) {
    sections.push({
      heading: "Notes",
      content: recipe.notes,
    });
  }

  await generatePDF({
    title: recipe.name,
    subtitle: "Fiche Recette",
    sections,
    metadata: {
      subject: `Fiche technique - ${recipe.name}`,
      keywords: `recette, ${recipe.category || ""}, parfumerie`,
    },
    pageUrl: `${window.location.origin}/recettes/${recipe.id}`,
    citationStyle: "APA",
  });
}
