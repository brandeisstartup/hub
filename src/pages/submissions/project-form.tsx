"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";
import slugify from "slugify";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";
import LongTextInput from "@/ui/components/forms/inputs/text-area";
import { usePostProject } from "@/hooks/usePostProject";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
// import { SignIn } from "@clerk/nextjs"; // Clerk's sign-in component
import { useAuth, SignInButton } from "@clerk/nextjs"; // or "@clerk/clerk-react"

import { useMergedUser } from "@/context/UserContext";

// Interface for form values
interface FormValues extends Record<string, unknown> {
  title: string;
  blurb: string; // short_description
  description: string; // long_description
  videoUrl: string;
}

function BigForm() {
  const { userId } = useAuth(); // or useUser() if you prefer
  const { user } = useMergedUser();
  const isSignedIn = !!userId; // true if user is signed in

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
    if (!isSignedIn) return; // Guard against submission if not signed in

    const variables = {
      title: data.title,
      creator_email: "creator@example.com", // Replace with user context or dynamic data
      short_description: data.blurb,
      long_description: data.description,
      competition: "",
      team_members_emails: [`${user?.email}`],
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
    <section className="relative flex justify-center items-center py-12">
      {/* Form */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 p-4 font-sans max-w-2xl backdrop-blur-sm">
          <Heading label={"Project Form"} />
          <h2>
            Add your project. You can add team members and edit this later.
          </h2>
          <div>
            <p className="text-blue-500">
              Your name and email {user?.email} will be associated with this
              project
            </p>
          </div>

          {/* Title Input */}
          <TextInput<FormValues>
            label="Title"
            name="title"
            placeholder="Enter title"
            register={register}
            required
            error={errors.title}
          />

          {/* Blurb Input */}
          <TextInput<FormValues>
            label="Blurb"
            name="blurb"
            placeholder="Enter a short description"
            register={register}
            required
            error={errors.blurb}
          />

          {/* Description Input */}
          <LongTextInput<FormValues>
            label="Description"
            name="description"
            placeholder="Enter a detailed description..."
            register={register}
            required
            error={errors.description}
            rows={5}
          />

          {/* Youtube URL Input */}
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

          {/* Submit Button */}
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
              className={`px-6 py-4 w-full rounded-3xl focus:ring-BrandeisBrand flex flex-row justify-center gap-1 ${
                isSignedIn
                  ? "bg-BrandeisBrand text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
              disabled={!isSignedIn}>
              Submit Project
            </button>
          )}
        </form>
      </FormProvider>

      {/* If user is NOT signed in, show an overlay with a sign-in modal */}
      {!isSignedIn && (
        <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <div className="max-w-sm p-4 bg-white rounded-md shadow-lg flex flex-col gap-2 justify-center items-center">
            <div className="">
              <h2> Must be signed in to continue</h2>
            </div>
            <div className="">
              <SignInButton />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default BigForm;
