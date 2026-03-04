// @ts-nocheck
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  includeKPIs?: boolean;
  includeCharts?: boolean;
  includeInsights?: boolean;
  includeTimeline?: boolean;
}

export async function exportStatisticsToPDF(options: ExportOptions = {}) {
  const {
    includeKPIs = true,
    includeCharts = true,
    includeInsights = true,
    includeTimeline = true,
  } = options;

  // Create PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Add header
  pdf.setFontSize(24);
  pdf.setTextColor(139, 92, 246); // Primary purple
  pdf.text('PERFUMUM', margin, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Rapport Statistiques Globales', margin, yPosition);
  
  yPosition += 6;
  pdf.setFontSize(10);
  pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition);
  
  // Add separator line
  yPosition += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Capture and add KPI cards
  if (includeKPIs) {
    const kpiSection = document.querySelector('[data-export="kpi-cards"]');
    if (kpiSection) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Indicateurs Clés', margin, yPosition);
      yPosition += 8;

      try {
        const canvas = await html2canvas(kpiSection as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('[PDF Export] Failed to capture KPI cards:', error);
      }
    }
  }

  // Capture and add charts
  if (includeCharts) {
    const chartsSection = document.querySelector('[data-export="charts"]');
    if (chartsSection) {
      // Check if we need a new page
      if (yPosition > pageHeight / 2) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Graphiques Analytiques', margin, yPosition);
      yPosition += 8;

      try {
        const canvas = await html2canvas(chartsSection as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('[PDF Export] Failed to capture charts:', error);
      }
    }
  }

  // Add insights section
  if (includeInsights) {
    const insightsSection = document.querySelector('[data-export="insights"]');
    if (insightsSection) {
      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Insights Clés', margin, yPosition);
      yPosition += 8;

      try {
        const canvas = await html2canvas(insightsSection as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('[PDF Export] Failed to capture insights:', error);
      }
    }
  }

  // Capture and add timeline
  if (includeTimeline) {
    const timelineSection = document.querySelector('[data-export="timeline"]');
    if (timelineSection) {
      // Always start timeline on a new page
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Évolution Temporelle', margin, yPosition);
      yPosition += 8;

      try {
        const canvas = await html2canvas(timelineSection as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      } catch (error) {
        console.error('[PDF Export] Failed to capture timeline:', error);
      }
    }
  }

  // Add footer to all pages
  const totalPages = (pdf as any).internal.pages.length - 1; // -1 because first element is metadata
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `PERFUMUM — Recherche Olfactive | Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const filename = `PERFUMUM_Statistiques_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
  
  return filename;
}
