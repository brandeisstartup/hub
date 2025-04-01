import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations";

interface EditableFieldNumberProps {
  label: string;
  fieldKey: string;
  value: number;
  userEmail: string; // Used as the unique identifier for the user
  onChange: (fieldKey: string, newValue: number) => void;
}

const EditableFieldNumber: React.FC<EditableFieldNumberProps> = ({
  label,
  fieldKey,
  value,
  userEmail,
  onChange
}) => {
  // We store the value as a string for the input element
  const [tempValue, setTempValue] = useState(String(value));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update local state if the parent value changes
  useEffect(() => {
    setTempValue(String(value));
  }, [value]);

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const handleSave = async () => {
    try {
      // Convert the temporary string value back to a number
      const finalValue = Number(tempValue);

      // Build the variables object dynamically to update only the desired field
      const variables = {
        email: userEmail,
        [fieldKey]: finalValue
      };

      const { data } = await updateUser({ variables });
      console.log(`Field ${fieldKey} updated to: ${finalValue}`, data);
      onChange(fieldKey, finalValue);
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
          <span className="flex-grow max-w-md truncate break-all">{value}</span>

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
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-2 border rounded mb-4"
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

export default EditableFieldNumber;
