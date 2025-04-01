import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations";

interface EditableFieldProps {
  label: string;
  fieldKey: string;
  value: string;
  userEmail: string; // Used as the unique identifier for the user
  onChange: (fieldKey: string, newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  fieldKey,
  value,
  userEmail,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Update local state if parent value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const handleSave = async () => {
    try {
      // Build the variables object dynamically to update only the desired field
      const variables = {
        email: userEmail,
        [fieldKey]: tempValue
      };

      const { data } = await updateUser({ variables });
      console.log(`Field ${fieldKey} updated to: ${tempValue}`, data);
      onChange(fieldKey, tempValue);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      <div className="mt-6 border-t divide-gray-100 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
        <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <span className="flex-grow max-w-md">{value}</span>
          <span className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint">
              Update
            </button>
          </span>
        </dd>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
            <h2 className="text-xl mb-4">Update {label}</h2>
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
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

export default EditableField;
