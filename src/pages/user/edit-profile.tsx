"use client";

import { useMergedUser } from "@/context/UserContext";
import { useAuth } from "@clerk/nextjs";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
// import EditUser from "@/ui/components/forms/edit-user"; // Your form component for editing user profile

export default function EditUserPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, loading: userLoading } = useMergedUser();

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }
  if (!isSignedIn) {
    return <div>Please sign in to view your profile and projects.</div>;
  }
  if (userLoading) {
    return <div>Loading user profile...</div>;
  }
  if (!user) {
    return <div>User not found.</div>;
  }

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <main className="py-24">
      <div className="mx-auto max-w-8xl px-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
        {/* Left Column: User Profile Data */}
        <section className="w-full border p-8 lg:sticky lg:top-36 h-fit lg:max-h-[90vh] overflow-auto lg:overflow-visible">
          <div className="flex items-center space-x-4">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="User avatar"
                className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            )}
            <h2 className="text-2xl font-sans md:text-4xl self-start text-start">
              {userName}
            </h2>
          </div>
          <dd className="flex flex-row gap-1 font-sans flex-wrap mt-2">
            <span className="font-medium">Email: </span>
            <span>{user.email}</span>
          </dd>
          <div className="mt-4 text-sm text-gray-700">
            <p>
              This is your profile information. You can update your details
              below.
            </p>
          </div>
        </section>

        {/* Right Column: Edit Profile Form */}
        <section className="w-full flex flex-col gap-6 border p-8">
          <Heading label="Edit Your Profile" />
          {/* Uncomment and use your edit form component when ready */}
          {/* <EditUser user={user} /> */}
          <div>
            <p>Edit user form goes here.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
