import { useState } from "react";

export function useImageUploader(onUploadComplete?: (url: string) => void) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const uploadFile = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const response = await fetch("/api/v1/uploads/images", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        setImageUrl(data.url);
        if (onUploadComplete) {
          onUploadComplete(data.url);
        }
      } else {
        console.error("No URL returned", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return { imageUrl, uploading, uploadFile, setSelectedFile };
}
