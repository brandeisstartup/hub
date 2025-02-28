// components/BigForm.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";

interface FormValues {
  title: string;
  otherData: string;
}

function BigForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ mode: "onSubmit" });
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert(
      `Title: ${data.title}\nOther Data: ${data.otherData}\nImage URL: ${uploadedImageUrl}`
    );
    // Further processing or backend submission goes here.
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Big Form</h2>

      {/* Title Input: pass required prop */}
      <TextInput
        label="Title"
        name="title"
        placeholder="Enter title"
        register={register}
        required
        error={errors.title}
      />

      {/* Other Data Input: pass required prop */}
      <TextInput
        label="Other Data"
        name="otherData"
        placeholder="Enter other data"
        register={register}
        required
        error={errors.otherData}
      />

      {/* Image Uploader */}
      <div>
        <ImageUploader
          label="Upload an Image"
          onUploadComplete={(url: string) => setUploadedImageUrl(url)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring focus:ring-green-300">
        Submit Big Form
      </button>
    </form>
  );
}

export default BigForm;
