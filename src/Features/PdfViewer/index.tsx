// import { useState } from 'react';
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// // Правильный путь для новых версий:
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

interface PDFViewerProps {
  url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
      style={{ width: '100%', height: '700px', border: 'none' }}
      title="PDF Viewer"
    />
  );
};

export default PDFViewer;