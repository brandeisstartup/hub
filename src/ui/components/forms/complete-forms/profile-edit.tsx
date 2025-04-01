import React, { useState } from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import EditableField from "@/ui/components/forms/inputs/editable-field-user";

interface EditUserProps {
  email: string;
  secondaryEmail?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

const EditUser: React.FC<EditUserProps> = (props) => {
  const [user, setUser] = useState({
    email: props.email,
    secondaryEmail: props.secondaryEmail || "",
    firstName: props.firstName || "",
    lastName: props.lastName || "",
    bio: props.bio || "",
    imageUrl: props.imageUrl || "",
    graduationYear: props.graduationYear || null,
    major: props.major || ""
  });

  const handleFieldUpdate = (fieldKey: string, newValue: string) => {
    console.log(`Updating ${fieldKey} to: ${newValue}`);
    setUser((prev) => ({ ...prev, [fieldKey]: newValue }));
  };

  return (
    <div className="font-sans">
      <Heading label={"Edit Your Profile"} />
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Update your profile information.
      </p>

      <EditableField
        label="Email"
        fieldKey="email"
        value={user.email}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Secondary Email"
        fieldKey="secondaryEmail"
        value={user.secondaryEmail}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="First Name"
        fieldKey="firstName"
        value={user.firstName}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Last Name"
        fieldKey="lastName"
        value={user.lastName}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Bio"
        fieldKey="bio"
        value={user.bio}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Image URL"
        fieldKey="imageUrl"
        value={user.imageUrl}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Graduation Year"
        fieldKey="graduationYear"
        value={user.graduationYear ? String(user.graduationYear) : ""}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Major"
        fieldKey="major"
        value={user.major}
        onChange={handleFieldUpdate}
        userEmail={user.email}
      />
    </div>
  );
};

export default EditUser;
