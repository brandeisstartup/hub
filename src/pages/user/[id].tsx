import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getAuth } from "@clerk/nextjs/server";
import apolloClient from "@/lib/apolloClient";
import { GET_USER_BY_CLERK_ID } from "@/lib/graphql/queries";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
// import EditUser from "@/ui/components/forms/edit-user"; // Your form component for editing user profile

// ----- GRAPHQL INTERFACES -----
interface GraphQLUser {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

// ----- PAGE DATA INTERFACE -----
interface UserData {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageUrl: string;
  graduationYear: number | null;
  major: string;
}

// ----- SSR PROPS & PARAMS -----
interface ServerSideProps {
  user: UserData;
}

interface Params extends ParsedUrlQuery {
  id: string; // This represents the Clerk ID of the user to edit
}

// ----- GET SERVER SIDE PROPS -----
export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Params
> = async ({ params, req }) => {
  if (!params?.id) {
    return { notFound: true };
  }
  const { id } = params;

  // Get the current user's Clerk ID from the request
  const { userId } = getAuth(req);

  // If the user is not authenticated, redirect them to sign-in
  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false
      }
    };
  }

  let graphQLUser: GraphQLUser | null = null;
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_BY_CLERK_ID,
      variables: { clerkId: id },
      fetchPolicy: "no-cache"
    });
    graphQLUser = data?.getUserByClerkId || null;
  } catch (err) {
    console.error("Error fetching user from GraphQL:", err);
  }

  if (!graphQLUser) {
    return { notFound: true };
  }

  // Ensure the signed-in user's clerkId matches the one in the user data
  if (graphQLUser.clerkId !== userId) {
    return {
      redirect: {
        destination: "/not-authorized", // Or handle as you prefer
        permanent: false
      }
    };
  }

  // Map the fetched data to our UserData interface
  const userData: UserData = {
    id: graphQLUser.id,
    clerkId: graphQLUser.clerkId,
    email: graphQLUser.email,
    firstName: graphQLUser.firstName || "",
    lastName: graphQLUser.lastName || "",
    bio: graphQLUser.bio || "",
    imageUrl: graphQLUser.imageUrl || "",
    graduationYear: graphQLUser.graduationYear || null,
    major: graphQLUser.major || ""
  };

  return {
    props: {
      user: userData
    }
  };
};

// ----- PAGE COMPONENT -----
export default function EditUserPage({ user }: ServerSideProps) {
  // For debugging, log the user data on the client
  console.log("Fetched user:", user);

  return (
    <main className="py-24">
      <Heading label="Edit Your Profile" />
      <div>{user.firstName}</div>
      {/* <EditUser user={user} /> */}
    </main>
  );
}
