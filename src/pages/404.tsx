import { useRouter } from "next/router";
import Button from "@/ui/components/brandeisBranding/buttons/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 select-none font-sans">404</h1>
          <div className="-mt-16 mb-6">
            <h2 className="text-2xl font-sans md:text-4xl text-center text-gray-900">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-12">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or deleted.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 justify-center items-center">
          <Button label="Return Home" href="/" color="blue" />
          <button
            onClick={() => router.back()}
            className="text-BrandeisBrand font-sans text-lg font-medium hover:underline transition-all"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
