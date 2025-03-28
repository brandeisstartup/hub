import React from "react";
import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left half: Background image (hidden on small screens) */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/lemberg.webp')" }}>
        {/* Optional: You can add overlay text or additional styling here */}
      </div>

      {/* Right half: Sign-in form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 font-sans">
        <div className="w-full max-w-md">
          {/* Top section with title and hint text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to the Brandeis Startup Hub
            </h1>
            <p className="mt-2 text-gray-600">
              Please sign in or create an account by using Google and accepting
              Clerk. You can edit your profile later.
            </p>
          </div>

          {/* Clerk's SignIn component */}
          <SignIn
            appearance={{
              layout: {
                // Using the logo inside the sign-in component
                logoImageUrl: "logo.webp",
                logoPlacement: "inside"
              },
              variables: {
                colorPrimary: "#6366F1",
                fontFamily: "Inter, sans-serif"
              },
              elements: {
                rootBox: "p-4"
              }
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
