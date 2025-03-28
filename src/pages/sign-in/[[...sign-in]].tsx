import React from "react";
import { SignIn } from "@clerk/nextjs";

type Props = {};

const Page = (props: Props) => {
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
          {/* Top section with logo, title and hint text */}
          <div className="mb-8 text-center">
            {/* <img src="/logo.webp" alt="Logo" className="mx-auto h-12 mb-4" /> */}
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to the Brandeis Startup Hub
            </h1>
            <p className="mt-2 text-gray-600">
              Please sign in or create an account by using Goolgle and accepting
              Clerk. You can edit your profile later.
            </p>
          </div>

          {/* Clerk's SignIn component */}
          <SignIn
            appearance={{
              layout: {
                // Hide the default logo since we already have one above
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
