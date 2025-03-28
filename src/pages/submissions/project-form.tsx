"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";
import slugify from "slugify";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import TextInput from "@/ui/components/forms/inputs/text-input";
import LongTextInput from "@/ui/components/forms/inputs/text-area";
import { usePostProject } from "@/hooks/usePostProject";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { useAuth, SignInButton, SignIn } from "@clerk/nextjs";
import { useMergedUser } from "@/context/UserContext";
// Import the Combobox component from Headless UI
import { Combobox } from "@headlessui/react";
// Import competitions from context
import { useCompetitions } from "@/context/EventContext";

// Extend form values with competition field
interface FormValues extends Record<string, unknown> {
  title: string;
  blurb: string; // short_description
  description: string; // long_description
  videoUrl: string;
  competition: string;
}

function BigForm() {
  const { userId } = useAuth();
  const { user } = useMergedUser();
  const isSignedIn = !!userId;

  const methods = useForm<FormValues>({ mode: "onSubmit" });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods;
  const router = useRouter();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { postProject } = usePostProject();
  const [loading, setLoading] = useState(false);

  // Get competitions data from the Competition context
  const { upcomingEvents, loading: compLoading } = useCompetitions();

  // Build competition options from the competitions data (assuming each competition has a "title" property)
  const competitionOptions = useMemo(() => {
    return upcomingEvents.map((comp) => comp.title);
  }, [upcomingEvents]);

  // Local state for the combobox value (allow string or null)
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(
    ""
  );

  // Sync selected competition with the react-hook-form field "competition"
  useEffect(() => {
    setValue("competition", selectedCompetition || "");
  }, [selectedCompetition, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!isSignedIn) return;

    const variables = {
      title: data.title,
      creator_email: `${user?.email}`,
      short_description: data.blurb,
      long_description: data.description,
      competition: data.competition || "",
      team_members_emails: [`${user?.email}`],
      video_url: data.videoUrl || null,
      image_url: uploadedImageUrl || null
    };

    try {
      setLoading(true);
      const project = await postProject(variables);
      setLoading(false);

      // Redirect to the new project page using a slugified title
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

          {/* Competition Combobox */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competition
            </label>
            <Combobox
              value={selectedCompetition}
              onChange={setSelectedCompetition}>
              <div className="relative">
                <Combobox.Input
                  className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select a competition"
                  displayValue={(value: string | null) => value || ""}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Combobox.Button>
              </div>
              <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {compLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Loading competitions...
                  </div>
                ) : competitionOptions.length > 0 ? (
                  competitionOptions.map((option) => (
                    <Combobox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? "bg-blue-600 text-white" : "text-gray-900"
                        }`
                      }>
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}>
                            {option}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                active ? "text-white" : "text-blue-600"
                              }`}>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 5.296a1 1 0 00-1.408-1.408L8 11.184 4.704 7.888a1 1 0 00-1.408 1.408l4 4a1 1 0 001.408 0l8-8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No competitions available
                  </div>
                )}
              </Combobox.Options>
            </Combobox>
          </div>

          {/* Image Uploader */}
          <div className="mt-4">
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
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
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

      {/* Overlay if user is not signed in */}
      {!isSignedIn && !user && (
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          {/* Top section with logo and title */}

          {/* Sign in prompt with matching background */}
          <div className="max-w-sm p-6 bg-white bg-opacity-70 rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col items-center mb-6">
              <img src="/logo.webp" alt="Logo" className="h-24 mb-2" />
            </div>
            <p className="text-gray-700 text-center">
              You must sign in or create an account by pressing the "Sign in
              with Google" button below. You can edit your profile later.
            </p>
            <SignInButton />
          </div>
        </div>
      )}
    </section>
  );
}

export default BigForm;
