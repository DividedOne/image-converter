export type Action = {
  file: any;
  fileName: string;
  fileSize: number;
  from: string;
  to: string | null;
  fileType: string;
  isConverting?: boolean;
  isConverted?: boolean;
  isError?: boolean;
  url?: any;
  output?: any;
};
