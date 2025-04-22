export function bytesToSize(bytes: number): String {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${sizes[i]}`;
}

export function compressFileName(fileName: string) {
  const MAX_SUBSTRING_LENGTH = 18;

  if (fileName.length < MAX_SUBSTRING_LENGTH) {
    return fileName.trim();
  }

  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".");

  const fileExtension = fileName.split(".").pop();

  if (!fileExtension) {
    throw new Error("File with no extension???");
  }

  const charsToKeep =
    MAX_SUBSTRING_LENGTH -
    (fileNameWithoutExtension.length + fileExtension.length + 3);

  const compressedFileName =
    fileNameWithoutExtension.substring(
      0,
      MAX_SUBSTRING_LENGTH - fileExtension.length - 3,
    ) +
    "..." +
    fileNameWithoutExtension.slice(-charsToKeep) +
    "." +
    fileExtension;

  return compressedFileName;
}
