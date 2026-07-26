import packageJson from 'pdfjs-dist/package.json';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${packageJson.version}/pdf.worker.min.js`;
