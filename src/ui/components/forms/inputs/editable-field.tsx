import React, { useState, useEffect } from "react";
import { useUpdateProjectField } from "@/hooks/useUpdateProjectField";

interface EditableFieldProps {
  label: string;
  fieldKey: string;
  value: string;
  projectId: number;
  onChange: (fieldKey: string, newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  fieldKey,
  value,
  projectId,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const { updateField } = useUpdateProjectField();

  // Update local state if parent value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = async () => {
    try {
      const updatedProject = await updateField(projectId, fieldKey, tempValue);
      console.log(`Field ${fieldKey} updated: ${tempValue}`, updatedProject);
      onChange(fieldKey, tempValue);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      <div className="mt-6 border-t divide-gray-100 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
        <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <span className="flex-grow">{value}</span>
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
