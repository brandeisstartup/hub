import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";
import LongTextInput from "@/ui/components/forms/inputs/text-area";
import { usePostProject } from "@/hooks/usePostProject"; // Adjust the path as needed

interface FormValues extends Record<string, unknown> {
  title: string;
  blurb: string; // For short_description
  description: string; // For long_description
  videoUrl: string;
}

function BigForm() {
  const methods = useForm<FormValues>({ mode: "onSubmit" });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = methods;
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { postProject } = usePostProject();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Map form fields to GraphQL mutation variables
    const variables = {
      title: data.title,
      creator_email: "creator@example.com", // Replace with user context or dynamic data
      short_description: data.blurb,
      long_description: data.description,
      competition: "", // or set a default competition value
      team_members_emails: ["brandeisstartup@gmail.com"],
      video_url: data.videoUrl || null,
      image_url: uploadedImageUrl || null
    };

    try {
      const project = await postProject(variables);
      alert(`Project created: ${project.title} (ID: ${project.id})`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("There was an error creating the project.");
    }
  };

  return (
    <section className="flex justify-center items-center py-12">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 p-4 font-sans max-w-3xl">
          <h2 className="text-2xl">Big Form</h2>

          {/* Title Input */}
          <TextInput<FormValues>
            label="Title"
            name="title"
            placeholder="Enter title"
            register={register}
            required
            error={errors.title}
          />

          {/* Blurb Input (maps to short_description) */}
          <TextInput<FormValues>
            label="Blurb"
            name="blurb"
            placeholder="Enter a short description"
            register={register}
            required
            error={errors.blurb}
          />

          {/* Description Input (maps to long_description) */}
          <LongTextInput<FormValues>
            label="Description"
            name="description"
            placeholder="Enter a detailed description..."
            register={register}
            required
            error={errors.description}
            rows={5}
          />

          {/* Youtube URL Input (maps to video_url) */}
          <TextInput<FormValues>
            label="Youtube URL"
            name="videoUrl"
            placeholder="Enter Youtube URL"
            register={register}
            type="url"
            error={errors.videoUrl}
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
            className="px-6 py-4 w-full bg-BrandeisBrand text-white rounded-3xl focus:ring-BrandeisBrand">
            Submit Big Form
          </button>
        </form>
      </FormProvider>
    </section>
  );
}

export default BigForm;
