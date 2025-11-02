export const handleDownload = async (
  pdfUrl: string,
  name: string,
  setIsDownloading: (v: boolean) => void
) => {
  setIsDownloading(true);
  try {
    const link = document.createElement("a");
    link.href = pdfUrl; // ← прямая ссылка на /media/book_pdf/...
    link.download = `${name}.pdf`;
    link.target = "_blank"; // откроет в новой вкладке, если браузер блокирует
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    window.open(pdfUrl, "_blank");
  } finally {
    setIsDownloading(false);
  }
};
