import React, { useState, useEffect } from "react";
import { useManageTeamMembers } from "@/hooks/useManageTeamMembers";

interface EditableFieldListProps {
  label: string;
  fieldKey: string;
  values: string[]; // Accepts an array of values
  projectId: number;
  onChange: (fieldKey: string, updatedValues: string[]) => void; // Updates entire array
}

const EditableFieldList: React.FC<EditableFieldListProps> = ({
  label,
  fieldKey,
  values,
  projectId,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [localValues, setLocalValues] = useState<string[]>(values); // Local state for tracking updates
  const { manageTeamMember, loading } = useManageTeamMembers();

  // ✅ Use effect to sync when `values` changes
  useEffect(() => {
    setLocalValues([...values]); // Ensures fresh reference to trigger re-renders
  }, [values]);

  const handleAdd = async () => {
    if (!newEmail.trim() || localValues.includes(newEmail)) return;
    try {
      await manageTeamMember(projectId, newEmail, "add");

      const updatedValues = [...localValues, newEmail];
      setLocalValues(updatedValues); // Update local state
      onChange(fieldKey, updatedValues);
      setNewEmail("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleRemove = async (email: string) => {
    try {
      await manageTeamMember(projectId, email, "remove");

      const updatedValues = localValues.filter((val) => val !== email);
      setLocalValues(updatedValues); // Update local state
      onChange(fieldKey, updatedValues);
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  return (
    <>
      <div className="mt-6 border-t divide-gray-100 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
        <dd className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <ul className="list-disc gap-1 flex flex-col">
            {localValues.length > 0 ? (
              localValues.map((email) => (
                <li
                  key={email}
                  className="flex rounded-md justify-between items-center  ">
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemove(email)}
                    className="inline-flex text-red-500 items-center px-4 py-2 border  text-sm font-medium rounded-md shadow-sm  transition duration-150"
                    disabled={loading}>
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <div className="flex justify-between items-center">
                <span>No team members</span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint">
                  Add Member
                </button>
              </div>
            )}
          </ul>
          {localValues.length > 0 && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 border rounded-md bg-white font-medium text-BrandeisBrand hover:text-BrandeisBrandeTint">
              Add Team Member
            </button>
          )}
        </dd>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
            <h2 className="text-xl mb-4">Manage {label}</h2>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter team member email"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {loading ? "Adding..." : "Add Team Member"}
            </button>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-200 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableFieldList;
