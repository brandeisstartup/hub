// hooks/useUpdateProjectField.ts
import { gql, useMutation } from "@apollo/client";

const UPDATE_PROJECT_FIELD = gql`
  mutation UpdateProjectField($id: Int!, $key: String!, $newValue: String) {
    updateProjectField(id: $id, key: $key, newValue: $newValue) {
      id
      title
      short_description
      long_description
      competition
      video_url
      image_url
    }
  }
`;

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
