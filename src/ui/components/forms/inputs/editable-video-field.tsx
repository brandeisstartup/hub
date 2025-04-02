import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUpdateProjectField } from "@/hooks/useUpdateProjectField";

interface EditableVideoFieldProps {
  label: string;
  projectId: number;
  value: string; // The current video embed URL (or empty if not set)
  onChange: (newValue: string) => void;
}

const EditableVideoField: React.FC<EditableVideoFieldProps> = ({
  label,
  projectId,
  value,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // We'll store the YouTube video ID as our input
  const [youtubeId, setYoutubeId] = useState("");
  // Preview URL built from the YouTube ID
  const [previewUrl, setPreviewUrl] = useState("");

  const { updateField } = useUpdateProjectField();

  // When the component mounts or value changes, try to extract the YouTube ID from the current embed URL.
  useEffect(() => {
    if (value) {
      const regex = /youtube\.com\/embed\/([^?&]+)/;
      const match = value.match(regex);
      if (match && match[1]) {
        setYoutubeId(match[1]);
        setPreviewUrl(`https://www.youtube.com/embed/${match[1]}`);
      } else {
        setYoutubeId("");
        setPreviewUrl("");
      }
    } else {
      setYoutubeId("");
      setPreviewUrl("");
    }
  }, [value]);

  const handleSave = async () => {
    if (!youtubeId) {
      toast.error("Please enter a valid YouTube video ID.");
      return;
    }
    // Build the embed URL
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    try {
      const updatedProject = await updateField(
        projectId,
        "video_url",
        embedUrl
      );
      console.log("Video field updated", updatedProject);
      onChange(embedUrl);
      toast.success("Video updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Video update failed. Please try again.");
    }
  };

  return (
    <>
      <div className="mt-6 border-t divide-gray-100 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
        <dd className="mt-1 flex flex-row justify-between text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div className="mb-2">
            {previewUrl ? (
              <iframe
                width="300"
                height="169"
                src={previewUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Preview"></iframe>
            ) : (
              <p>No video set.</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint">
            Update Video
          </button>
        </dd>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
            <h2 className="text-xl mb-4">Update {label}</h2>
            <p className="mb-2">Enter the YouTube video ID:</p>
            <input
              type="text"
              value={youtubeId}
              onChange={(e) => {
                setYoutubeId(e.target.value);
                // Update the preview as the user types
                setPreviewUrl(
                  `https://www.youtube.com/embed/${e.target.value}`
                );
              }}
              className="w-full p-2 border rounded mb-4"
              placeholder="e.g., dQw4w9WgXcQ"
            />
            <div className="mb-4">
              <p className="text-sm text-gray-600">Preview:</p>
              {youtubeId ? (
                <iframe
                  width="300"
                  height="169"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Preview"></iframe>
              ) : (
                <p className="text-sm text-gray-500">No preview available.</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-BrandeisBrand hover:bg-BrandeisBrandeTint text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableVideoField;
