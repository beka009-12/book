/**
 * Утилита для скачивания PDF файлов
 */

export const handleDownload = async (
  id: string,
  name: string,
  setIsDownloading: (v: boolean) => void
) => {
  setIsDownloading(true);

  try {
    const downloadUrl = `${window.location.protocol}//${
      window.location.hostname
    }${
      window.location.port ? `:${window.location.port}` : ""
    }/books/${id}/download/`;

    // Скачиваем файл через fetch
    const response = await fetch(downloadUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Проверяем тип контента
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/pdf")) {
      // Если это не PDF, открываем в новой вкладке
      console.warn("Received non-PDF content, opening in new tab");
      window.open(downloadUrl, "_blank");
      return;
    }

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${name}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("Download error:", error);
    alert(
      "Ката кетти! Файлды жүктөөгө болбоду. Интернет туташууну текшериңиз."
    );
  } finally {
    setIsDownloading(false);
  }
};

export const handleDirectDownload = async (
  pdfUrl: string,
  name: string,
  setIsDownloading: (v: boolean) => void
) => {
  setIsDownloading(true);

  try {
    // Пробуем скачать через fetch + blob
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("Download error:", error);

    // Fallback - открываем в новой вкладке
    window.open(pdfUrl, "_blank");
  } finally {
    setIsDownloading(false);
  }
};
