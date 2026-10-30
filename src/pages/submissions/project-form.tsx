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
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useMergedUser } from "@/context/UserContext";
import { useCompetitions } from "@/context/EventContext";
import toast from "react-hot-toast";

interface FormValues extends Record<string, unknown> {
  title: string;
  blurb: string; // short_description
  description: string; // long_description
  videoUrl?: string; // Now just the YouTube video ID
  competition: string;
}

const ALLOWED_COMPETITIONS = [
  "Ain Family Start-Up Award",
  "Brandeis Pitch",
  "Brandeis Social Impact Startup Challenge",
  "Builders and Backers Incubator",
  "Tech-Bash"
];

function BigForm() {
  const { userId } = useAuth();
  const { user } = useMergedUser();
  const isSignedIn = !!userId;

  const methods = useForm<FormValues>({ mode: "onSubmit" });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = methods;
  const router = useRouter();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { postProject } = usePostProject();
  const [loading, setLoading] = useState(false);

  // Competitions from context
  const { competitions, loading: compLoading } = useCompetitions();
  const competitionOptions = useMemo(
    () => {
      const availableTitles = new Set(
        competitions.map((competition) => competition.title.trim())
      );
      return ALLOWED_COMPETITIONS.filter((title) => availableTitles.has(title));
    },
    [competitions]
  );
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
  useEffect(() => {
    setValue("competition", selectedCompetitions.join(", "));
  }, [selectedCompetitions, setValue]);

  // Watch the videoUrl field (which now holds just the YouTube video ID)
  const youtubeId = watch("videoUrl");
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : "";

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!isSignedIn) return;

    // Only accept an 11-character YouTube ID (optional). Reject full URLs.
    const idPattern = /^[A-Za-z0-9_-]{11}$/;
    if (data.videoUrl && !idPattern.test(String(data.videoUrl).trim())) {
      toast.error("Please enter exactly the 11-character YouTube ID (NOT a full URL).");
      return;
    }

    const variables = {
      title: data.title,
      creator_email: `${user?.email}`,
      short_description: data.blurb,
      long_description: data.description,
      competition: data.competition || "",
      team_members_emails: [`${user?.email}`],
      video_url: data.videoUrl ? String(data.videoUrl).trim() : null,
      image_url: uploadedImageUrl || null
    };

    try {
      setLoading(true);
      const project = await postProject(variables);
      setLoading(false);
      const projectSlug = slugify(project.title);
      toast.success("Project created successfully!");
      router.push(`/projects/${projectSlug}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error creating project. Please try again!");
    }
  };

  return (
    <section className="relative flex justify-center items-center py-12 pt-32">
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

          <TextInput<FormValues>
            label="Title"
            name="title"
            placeholder="Enter title"
            register={register}
            error={errors.title}
            required
            pattern={/^[A-Za-z0-9 ]{3,25}$/}
            patternMessage="Title must be 3–25 characters, and only letters, numbers & spaces (no : - % # @ etc)."
          />

          <TextInput<FormValues>
            label="Blurb"
            name="blurb"
            placeholder="Enter a short description"
            register={register}
            required
            error={errors.blurb}
          />

          <LongTextInput<FormValues>
            label="Description"
            name="description"
            placeholder="Enter a detailed description..."
            register={register}
            required
            error={errors.description}
            rows={5}
          />

          <TextInput<FormValues>
            label="YouTube Video ID (optional)"
            name="videoUrl"
            placeholder="Enter YouTube ID (e.g., dQw4w9WgXcQ)"
            register={register}
            type="text"
            error={errors.videoUrl}
            pattern={
              /^(?!(?:https?:\/\/|www\.|.*youtube\.com|.*youtu\.be))[A-Za-z0-9_-]{11}$/
            }
            patternMessage="Please enter exactly the 11‐character Youtube ID (NOT the full URL). Make sure preview works"
          />

          {youtubeId && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Video Preview:</p>
              <iframe
                width="300"
                height="169"
                src={embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Preview"></iframe>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competition
            </label>
            {compLoading ? (
              <p className="text-sm text-gray-500">Loading competitions...</p>
            ) : competitionOptions.length > 0 ? (
              <div className="max-h-60 space-y-2 overflow-auto rounded-md border border-gray-300 p-3">
                {competitionOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCompetitions.includes(option)}
                      onChange={(event) =>
                        setSelectedCompetitions((selected) =>
                          event.target.checked
                            ? [...selected, option]
                            : selected.filter((item) => item !== option)
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No competitions available</p>
            )}
            {selectedCompetitions.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedCompetitions.join(", ")}
              </p>
            )}
          </div>

          <div className="mt-4">
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
              className={`px-6 py-4 w-full rounded-3xl focus:ring-BrandeisBrand flex flex-row justify-center gap-1 ${isSignedIn
                ? "bg-BrandeisBrand text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              disabled={!isSignedIn}>
              Submit Project
            </button>
          )}
        </form>
      </FormProvider>

      {!isSignedIn && !user && (
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex flex-col items-center justify-center z-4">
          <div className="max-w-sm p-6 bg-white bg-opacity-70 rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col items-center mb-6">
              <img src="/logo.webp" alt="Logo" className="h-24 mb-2" />
            </div>
            <p className="text-gray-700 text-center">
              You must sign in or create an account by pressing the{" "}
              <span className="font-semibold">Sign in with Google</span> button
              below. You can edit your profile later.
            </p>
            <SignInButton />
          </div>
        </div>
      )}
    </section>
  );
}

export default BigForm;
