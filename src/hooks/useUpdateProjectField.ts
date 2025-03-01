import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_FIELD } from "@/lib/graphql/mutations";

export const useUpdateProjectField = () => {
  const [updateMutation, { data, error, loading }] =
    useMutation(UPDATE_PROJECT_FIELD);

  const updateField = async (id: number, key: string, newValue?: string) => {
    try {
      const result = await updateMutation({
        variables: { id, key, newValue }
      });
      return result.data.updateProjectField;
    } catch (err) {
      console.error("Error updating field:", err);
      throw err;
    }
  };

  return { updateField, data, error, loading };
};
