export const handleDownload = async (
  id: string,
  name: string,
  setIsDownloading: any
) => {
  const downloadUrl = `${window.location.protocol}//${
    window.location.hostname
  }${
    window.location.port ? `:${window.location.port}` : ""
  }/books/${id}/download/`;

  setIsDownloading(true);
  try {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    window.open(downloadUrl, "_blank");
  } finally {
    setIsDownloading(false);
  }
};
