export const handleDownload = async (
  id: string,
  name: string,
  setIsDownloading: (v: boolean) => void
) => {
  const downloadUrl = `${window.location.origin}/books/${id}/download`;

  setIsDownloading(true);
  try {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${name}.pdf`;
    link.style.display = "none";
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
