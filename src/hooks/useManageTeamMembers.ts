import { useMutation } from "@apollo/client";
import {
  ADD_PROJECT_TEAM_MEMBER,
  REMOVE_PROJECT_TEAM_MEMBER
} from "@/lib/graphql/mutations";

export const useManageTeamMembers = () => {
  const [
    addTeamMemberMutation,
    { data: addData, error: addError, loading: addLoading }
  ] = useMutation(ADD_PROJECT_TEAM_MEMBER);

  const [
    removeTeamMemberMutation,
    { data: removeData, error: removeError, loading: removeLoading }
  ] = useMutation(REMOVE_PROJECT_TEAM_MEMBER);

  const manageTeamMember = async (
    id: number,
    email: string,
    action: "add" | "remove"
  ) => {
    try {
      if (!email) throw new Error("Email is required to modify team members.");

      if (action === "add") {
        const result = await addTeamMemberMutation({
          variables: { id, email }
        });
        return result.data?.addTeamMember;
      } else if (action === "remove") {
        const result = await removeTeamMemberMutation({
          variables: { id, email }
        });
        return result.data?.removeTeamMember;
      } else {
        throw new Error('Invalid action. Use "add" or "remove".');
      }
    } catch (err) {
      console.error("Error managing team member:", err);
      throw err;
    }
  };

  return {
    manageTeamMember,
    data: addData || removeData,
    error: addError || removeError,
    loading: addLoading || removeLoading
  };
};
