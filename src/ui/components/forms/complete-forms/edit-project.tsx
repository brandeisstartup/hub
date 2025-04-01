import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import EditableField from "@/ui/components/forms/inputs/editable-field";
import EditableFieldList from "../inputs/editable-field-list";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import { UPDATE_PROJECT_FIELD } from "@/lib/graphql/mutations";

interface EditProjectProps {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  competition: string;
  video_url: string;
  image_url: string;
  team_members_emails: string[];
}

const EditProject: React.FC<EditProjectProps> = (props) => {
  const [project, setProject] = useState({
    title: props.title,
    short_description: props.short_description,
    long_description: props.long_description,
    competition: props.competition,
    video_url: props.video_url,
    image_url: props.image_url,
    team_members_emails: [...props.team_members_emails] // Ensure fresh reference
  });

  // State to control the key for ImageUploader to force remount
  const [uploaderKey, setUploaderKey] = useState(0);

  // Prepare the mutation hook using the provided UPDATE_PROJECT_FIELD mutation
  const [updateProjectField] = useMutation(UPDATE_PROJECT_FIELD);

  const handleFieldUpdate = (fieldKey: string, newValue: string) => {
    console.log(`Updating ${fieldKey} to: ${newValue}`);
    setProject((prev) => ({ ...prev, [fieldKey]: newValue }));
    toast.success(`${fieldKey} updated successfully!`);
  };

  const handleFieldListUpdate = (fieldKey: string, updatedValues: string[]) => {
    console.log(`Updating ${fieldKey} to:`, updatedValues);
    setProject((prev) => ({
      ...prev,
      [fieldKey]: [...updatedValues] // Ensure new reference
    }));
    toast.success(`${fieldKey} updated successfully!`);
  };

  // Handler for image upload completion using UPDATE_PROJECT_FIELD mutation
  const handleImageUploadComplete = async (url: string) => {
    try {
      const variables = {
        id: props.id,
        key: "image_url",
        newValue: url
      };
      const { data } = await updateProjectField({ variables });
      console.log("Image updated:", data);
      setProject((prev) => ({ ...prev, image_url: url }));
      // Force the ImageUploader to remount by updating the key
      setUploaderKey((prev) => prev + 1);
      toast.success("Project image updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Image update failed. Please try again.");
    }
  };

  return (
    <div className="font-sans">
      <Heading label={"Edit Project"} />
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Project details and media.
      </p>

      <EditableField
        label="Title"
        fieldKey="title"
        value={project.title}
        onChange={handleFieldUpdate}
        projectId={props.id}
      />
      <EditableField
        label="Short Description"
        fieldKey="short_description"
        value={project.short_description}
        onChange={handleFieldUpdate}
        projectId={props.id}
      />
      <EditableField
        label="Long Description"
        fieldKey="long_description"
        value={project.long_description}
        onChange={handleFieldUpdate}
        projectId={props.id}
      />
      <EditableField
        label="Video URL"
        fieldKey="video_url"
        value={project.video_url}
        onChange={handleFieldUpdate}
        projectId={props.id}
      />

      {/* Image uploader row */}
      <div className="mt-6 border-t divide-gray-100 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">
          Project Image
        </dt>
        <dd className="mt-1 flex items-center text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 justify-between">
          <img
            src={project.image_url}
            alt="Project Image"
            className="rounded w-28 h-28 object-cover"
          />
          <span className="ml-4 max-w-xxxs">
            <ImageUploader
              key={uploaderKey}
              label=""
              onUploadComplete={handleImageUploadComplete}
            />
          </span>
        </dd>
      </div>

      <EditableFieldList
        label="Team Members"
        fieldKey="team_members_email"
        values={project.team_members_emails}
        projectId={props.id}
        onChange={handleFieldListUpdate}
      />
    </div>
  );
};

export default EditProject;
