declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }

  function PDFParse(dataBuffer: Buffer, options?: unknown): Promise<PDFData>;
  export = PDFParse;
} 