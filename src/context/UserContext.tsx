import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_CLERK_ID } from "@/lib/graphql/queries";

type User = {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  updateUser: (newData: Partial<User>) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
  updateUser: () => {}
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const {
    data,
    loading: dbLoading,
    error: dbError
  } = useQuery(GET_USER_BY_CLERK_ID, {
    skip: !clerkUser,
    variables: { clerkId: clerkUser?.id },
    fetchPolicy: "cache-and-network"
  });

  const loading = !clerkLoaded || dbLoading;
  const error = dbError || null;

  // Memoize the merged user data from Clerk and Apollo
  const initialMergedUser = useMemo(() => {
    if (clerkUser && data?.getUserByClerkId) {
      return {
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        firstName: data.getUserByClerkId.firstName || clerkUser.firstName || "",
        lastName: data.getUserByClerkId.lastName || clerkUser.lastName || "",
        imageUrl: data.getUserByClerkId.imageUrl || ""
      };
    }
    return null;
  }, [clerkUser, data]);

  // Use state to allow manual updates
  const [mergedUser, setMergedUser] = useState<User | null>(initialMergedUser);

  // Update the state when initialMergedUser changes
  useEffect(() => {
    setMergedUser(initialMergedUser);
  }, [initialMergedUser]);

  // Function to update user data in context manually
  const updateUser = (newData: Partial<User>) => {
    setMergedUser((prevUser) => {
      if (!prevUser) return prevUser;
      return { ...prevUser, ...newData };
    });
  };

  return (
    <UserContext.Provider
      value={{ user: mergedUser, loading, error, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useMergedUser() {
  return useContext(UserContext);
}
