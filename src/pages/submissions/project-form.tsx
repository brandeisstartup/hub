import React, { useState } from "react";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";

function BigForm() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [otherData, setOtherData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the uploadedImageUrl and other form data for your submission
    console.log("Image URL:", uploadedImageUrl);
    console.log("Other Data:", otherData);
    // You could send this data to your API or handle it as needed.
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Big Form</h2>

      {/* Other form fields */}
      <label>
        Some Other Data:
        <input
          type="text"
          value={otherData}
          onChange={(e) => setOtherData(e.target.value)}
        />
      </label>

      <div>
        <h3>Upload an Image</h3>
        <ImageUploader
          onUploadComplete={(url: string) => setUploadedImageUrl(url)}
        />
      </div>

      <button type="submit">Submit Big Form</button>

      {uploadedImageUrl && (
        <div>
          <p>Image uploaded at: {uploadedImageUrl}</p>
        </div>
      )}
    </form>
  );
}

export default BigForm;
