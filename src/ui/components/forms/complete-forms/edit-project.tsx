import React, { useState } from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import EditableField from "@/ui/components/forms/inputs/editable-field";
import EditableFieldList from "../inputs/editable-field-list";

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

  const handleFieldUpdate = (fieldKey: string, newValue: string) => {
    console.log(`Updating ${fieldKey} to: ${newValue}`);
    setProject((prev) => ({ ...prev, [fieldKey]: newValue }));
  };

  const handleFieldListUpdate = (fieldKey: string, updatedValues: string[]) => {
    console.log(`Updating ${fieldKey} to:`, updatedValues);

    setProject((prev) => ({
      ...prev,
      [fieldKey]: [...updatedValues] // Ensure new reference
    }));
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
      <EditableField
        label="Image URL"
        fieldKey="image_url"
        value={project.image_url}
        onChange={handleFieldUpdate}
        projectId={props.id}
      />

      {/* ✅ FIX: Use `project.team_members_emails` to ensure UI updates */}
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
