import React, { useState } from "react";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";

function BigForm() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [otherData, setOtherData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(uploadedImageUrl + otherData);
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
        <ImageUploader
          label="Upload an Image"
          onUploadComplete={(url: string) => setUploadedImageUrl(url)}
        />
      </div>

      <button type="submit">Submit Big Form</button>
    </form>
  );
}

export default BigForm;
