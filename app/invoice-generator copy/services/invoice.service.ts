import { ClassicTemplate } from '../templates/classic';
import { ModernTemplate } from '../templates/modern';
import { MinimalistTemplate } from '../templates/minimalist';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimalist: MinimalistTemplate
};

export const generatePDF = async (element: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  return pdf.output('blob');
};

export const sendEmail = async (
  to: string,
  subject: string,
  pdfBlob: Blob
): Promise<void> => {
  const formData = new FormData();
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('pdf', pdfBlob, 'factura.pdf');

  // Aquí deberías implementar la llamada a tu API para enviar el email
  // Por ejemplo:
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   body: formData
  // });
};
