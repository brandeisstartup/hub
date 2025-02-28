import React from "react";

type Props = {};

function UploadForm({}: Props) {
  return (
    <form
      action="/api/v1/uploads/images"
      method="POST"
      encType="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
