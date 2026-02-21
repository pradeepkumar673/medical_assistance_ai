import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

export default function DownloadPDF({ analysis, elementId }) {
  const { t } = useTranslation();

  const downloadPDF = async () => {
    const input = document.getElementById(elementId);
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`analysis_${analysis.id}.pdf`);
  };

  return (
    <button
      onClick={downloadPDF}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      {t('download_pdf')}
    </button>
  );
}