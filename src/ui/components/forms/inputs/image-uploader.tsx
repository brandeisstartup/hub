// components/ImageUploader.tsx
import React, { useState, useEffect } from "react";
import { useImageUploader } from "@/hooks/useImageUploader";
import Image from "next/image";

type ImageUploaderProps = {
  onUploadComplete?: (url: string) => void;
  label: string;
};

function ImageUploader({ onUploadComplete, label }: ImageUploaderProps) {
  const { imageUrl, uploading, uploadFile, setSelectedFile } =
    useImageUploader(onUploadComplete);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // When a file is selected, store it and open the preview modal.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowModal(true);
    }
  };

  // Handle drag-and-drop similar to file input
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      e.dataTransfer.clearData();
      setShowModal(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Reset the file selection (also used by the Cancel button)
  const handleEdit = () => {
    setSelectedFile(null);
    setFileName("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setShowModal(false);
  };

  // Clean up the object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // When the user confirms in the modal, trigger the upload.
  const handleConfirmUpload = async () => {
    await uploadFile();
    setShowModal(false);
  };

  return (
    <fieldset className="border border-gray-300 p-4 rounded-md">
      <legend className="text-lg font-semibold">{label}</legend>

      {fileName ? (
        // When a file is selected, show its name with "Preview" and "Edit" buttons.
        <div className="border border-gray-300 p-4 text-center rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Selected File:</strong> {fileName}
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
              aria-label="Preview selected image">
              Preview
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-700 focus:ring focus:ring-gray-300"
              aria-label="Edit selected image">
              Edit
            </button>
          </div>
        </div>
      ) : (
        // If no file is selected, show the drop zone and file input.
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          className={`border-2 border-dashed p-4 text-center rounded-md cursor-pointer transition ${
            isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}>
          <label htmlFor="file-upload" className="cursor-pointer block">
            {isDragging
              ? "Release to drop your image"
              : "Drag and drop your image here, or click to select."}
          </label>
          <input
            id="file-upload"
            type="file"
            name="file"
            onChange={handleFileChange}
            required
            className="hidden"
          />
        </div>
      )}

      {uploading && (
        <div className="mt-3 text-sm text-blue-600">Uploading...</div>
      )}

      {/* Modal for previewing the image */}
      {showModal && previewUrl && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Preview Image</h2>
            <div className="mb-4 flex justify-center">
              <Image
                height={300}
                width={300}
                src={previewUrl}
                alt="Preview of selected image"
                className="h-[300px] w-[300px] object-cover rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:ring focus:ring-gray-300">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={uploading}
                className={`px-4 py-2 rounded-md ${
                  uploading
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300"
                }`}>
                {uploading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}

export default ImageUploader;
