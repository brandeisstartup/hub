import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";
import slugify from "slugify";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";
import LongTextInput from "@/ui/components/forms/inputs/text-area";
import { usePostProject } from "@/hooks/usePostProject";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

// Utility function to create a URL-friendly slug
// const slugify = (text: string) =>
//   text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
//     .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

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
  const router = useRouter();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { postProject } = usePostProject();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const variables = {
      title: data.title,
      creator_email: "creator@example.com", // Replace with user context or dynamic data
      short_description: data.blurb,
      long_description: data.description,
      competition: "",
      team_members_emails: ["brandeisstartup@gmail.com"],
      video_url: data.videoUrl || null,
      image_url: uploadedImageUrl || null
    };

    try {
      setLoading(true);
      const project = await postProject(variables);
      setLoading(false);

      // Redirect to the new project page using slugified title
      const projectSlug = slugify(project.title);
      router.push(`/projects/${projectSlug}`);
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
          className="w-full space-y-4 p-4 font-sans max-w-2xl">
          <Heading label={"Project Form"} />
          <p>Add your project, you can add team members and edit this later.</p>

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

          {loading ? (
            <button
              type="submit"
              disabled
              className="px-6 py-4 w-full bg-BrandeisBrand text-white rounded-3xl focus:ring-BrandeisBrand flex flex-row justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Submitting Project...
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-4 w-full bg-BrandeisBrand text-white rounded-3xl focus:ring-BrandeisBrand flex flex-row justify-center gap-1">
              Submit Project
            </button>
          )}
        </form>
      </FormProvider>
    </section>
  );
}

export default BigForm;
