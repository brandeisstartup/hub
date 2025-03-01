// EditProject.tsx
import React, { useState } from "react";
import EditableField from "@/ui/components/forms/inputs/editable-field";

interface EditProjectProps {
  title: string;
  short_description: string;
  long_description: string;
  competition: string;
  video_url: string;
  imageUrl: string;
}

const EditProject: React.FC<EditProjectProps> = (props) => {
  const [project, setProject] = useState({
    title: props.title,
    short_description: props.short_description,
    long_description: props.long_description,
    competition: props.competition,
    video_url: props.video_url,
    imageUrl: props.imageUrl
  });

  const handleFieldUpdate = (fieldKey: string, newValue: string) => {
    console.log(`Updating ${fieldKey} to: ${newValue}`);
    setProject((prev) => ({ ...prev, [fieldKey]: newValue }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <EditableField
        label="Title"
        fieldKey="title"
        value={project.title}
        onChange={handleFieldUpdate}
      />
      <EditableField
        label="Short Description"
        fieldKey="short_description"
        value={project.short_description}
        onChange={handleFieldUpdate}
      />
      <EditableField
        label="Long Description"
        fieldKey="long_description"
        value={project.long_description}
        onChange={handleFieldUpdate}
      />

      <EditableField
        label="Video URL"
        fieldKey="video_url"
        value={project.video_url}
        onChange={handleFieldUpdate}
      />
      <EditableField
        label="Image URL"
        fieldKey="imageUrl"
        value={project.imageUrl}
        onChange={handleFieldUpdate}
      />
    </div>
  );
};

export default EditProject;
