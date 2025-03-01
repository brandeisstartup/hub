import { useMutation } from "@apollo/client";
import { DELETE_PROJECT_FIELD } from "@/lib/graphql/mutations";

export const useDeleteProject = () => {
  const [deleteMutation, { data, error, loading }] =
    useMutation(DELETE_PROJECT_FIELD);

  const deleteProject = async (id: number) => {
    try {
      const result = await deleteMutation({
        variables: { id }
      });
      return result.data.deleteProject;
    } catch (err) {
      console.error("Error deleting project:", err);
      throw err;
    }
  };

  return { deleteProject, data, error, loading };
};
