import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Важно: Указываем путь к worker'у
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error ? (
        <div style={{ color: 'red' }}>Ошибка загрузки PDF: {error}</div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(error) => setError(error.message)}
          loading={<div>Загрузка PDF...</div>}
          error={<div>Не удалось загрузить PDF</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              loading={<div>Загрузка страницы {index + 1}...</div>}
            />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;