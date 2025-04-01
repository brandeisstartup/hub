import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast"; // Import react-hot-toast
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import EditableField from "@/ui/components/forms/inputs/editable-field-user";
import EditableFieldNumber from "@/ui/components/forms/inputs/editable-field-number";
import ImageUploader from "@/ui/components/forms/inputs/image-uploader";
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations";

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
    graduationYear: props.graduationYear ?? null,
    major: props.major || ""
  });

  // State to control the key for ImageUploader to force remount
  const [uploaderKey, setUploaderKey] = useState(0);

  // Prepare the mutation hook
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  // Handler for text fields
  const handleFieldUpdate = async (fieldKey: string, newValue: string) => {
    try {
      const variables = {
        email: user.email,
        [fieldKey]: newValue
      };
      const { data } = await updateUser({ variables });
      console.log(`Field ${fieldKey} updated to: ${newValue}`, data);
      setUser((prev) => ({ ...prev, [fieldKey]: newValue }));
      toast.success(`${fieldKey} updated successfully!`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed. Please try again.");
    }
  };

  // Handler for numeric fields
  const handleNumberFieldUpdate = async (
    fieldKey: string,
    newValue: number
  ) => {
    try {
      const variables = {
        email: user.email,
        [fieldKey]: newValue
      };
      const { data } = await updateUser({ variables });
      console.log(`Field ${fieldKey} updated to: ${newValue}`, data);
      setUser((prev) => ({ ...prev, [fieldKey]: newValue }));
      toast.success(`${fieldKey} updated successfully!`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed. Please try again.");
    }
  };

  // Handler for image upload completion
  const handleImageUploadComplete = async (url: string) => {
    try {
      const variables = {
        email: user.email,
        imageUrl: url
      };
      const { data } = await updateUser({ variables });
      console.log(`Image updated to: ${url}`, data);
      setUser((prev) => ({ ...prev, imageUrl: url }));
      // Force the ImageUploader to remount by updating the key
      setUploaderKey((prev) => prev + 1);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Image update failed. Please try again.");
    }
  };

  return (
    <div className="font-sans">
      <Heading label={"Edit Your Profile"} />
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Update your profile information.
      </p>

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

      <div className="mt-6 border-t divide-gray-100 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">
          Profile Picture
        </dt>
        <dd className="mt-1 flex items-center text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 justify-between">
          <img
            src={user.imageUrl}
            alt="Profile Picture"
            className="rounded-full w-28 h-28 object-cover"
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

      <EditableFieldNumber
        label="Graduation Year"
        fieldKey="graduationYear"
        value={user.graduationYear ?? 2028}
        onChange={handleNumberFieldUpdate}
        userEmail={user.email}
      />
      <EditableField
        label="Major"
        fieldKey="major"
        value={user.major}
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
    </div>
  );
};

export default EditUser;
