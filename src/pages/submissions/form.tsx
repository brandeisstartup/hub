import React from "react";

function Form() {
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

export default Form;
