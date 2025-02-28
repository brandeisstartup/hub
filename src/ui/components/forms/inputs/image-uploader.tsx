// components/ImageUploader.tsx
import React, { useState } from "react";

type ImageUploaderProps = {
  onUploadComplete?: (url: string) => void;
};

function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
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

  return (
    <div>
      <input type="file" name="file" onChange={handleFileChange} required />
      <button type="button" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      {imageUrl && (
        <div>
          <p>Uploaded Image URL: {imageUrl}</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
