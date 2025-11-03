/**
 * Fetches a file from a URL and triggers a download prompt for the user.
 * This is useful for forcing downloads of cross-origin resources where the
 * 'download' attribute on an <a> tag might not be respected by the browser.
 * 
 * @param url The URL of the file to download.
 * @param fileName The name to suggest for the downloaded file.
 */
export const forceDownload = async (url: string, fileName: string) => {
  try {
    // Use a CORS proxy if needed, but for this app, we assume direct access is possible.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    // Get the raw data as an ArrayBuffer and create a new Blob.
    // This avoids issues with problematic MIME types like 'application/octet-stream'
    // from the server's response headers.
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = window.document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = fileName;
    
    window.document.body.appendChild(a);
    a.click();
    
    // Clean up the temporary URL and anchor element
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  } catch (error) {
    console.error('Download failed:', error);
    // Re-throw the error to be handled by the calling function (e.g., to show a toast)
    throw error;
  }
};