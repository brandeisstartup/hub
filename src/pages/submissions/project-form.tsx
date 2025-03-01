// components/BigForm.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";
// import ListInput from "@/ui/components/forms/inputs/list-input";

interface FormValues extends Record<string, unknown> {
  title: string;
  otherData: string;
  items: string[];
}

function BigForm() {
  const methods = useForm<FormValues>({ mode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors }
  } = methods;
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    alert(
      `Title: ${data.title}\nOther Data: ${
        data.otherData
      }\nItems: ${data.items.join(", ")}\nImage URL: ${uploadedImageUrl}`
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-2xl font-bold">Big Form</h2>

        {/* Required Title Input */}
        <TextInput<FormValues>
          label="Title"
          name="title"
          placeholder="Enter title"
          register={methods.register}
          required
          error={errors.title}
        />

        {/* Required Other Data Input */}
        <TextInput<FormValues>
          label="Other Data"
          name="otherData"
          placeholder="Enter other data"
          register={methods.register}
          required
          error={errors.otherData}
        />

        {/* Image Uploader */}
        <div>
          <ImageUploader
            label="Upload an Image (Optional)"
            onUploadComplete={(url: string) => setUploadedImageUrl(url)}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring focus:ring-green-300">
          Submit Big Form
        </button>
      </form>
    </FormProvider>
  );
}

export default BigForm;
