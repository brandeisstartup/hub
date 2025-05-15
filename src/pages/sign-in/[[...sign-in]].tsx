import React from "react";
import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/lemberg.webp')" }}></div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 font-sans">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to the Brandeis Startup Hub
            </h1>
            <p className="mt-2 text-gray-600">
              Please sign in or create an account by using Google and accepting
              Clerk. You can edit your profile later.
            </p>
          </div>

          <SignIn
            appearance={{
              layout: {
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
