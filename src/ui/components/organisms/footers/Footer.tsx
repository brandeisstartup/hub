import Logo from "@/ui/components/molecules/logo/logo";

function getCurrentYear() {
  return new Date().getFullYear();
}
const currentYear = getCurrentYear();

export default function Footer() {
  return (
    <footer className="bg-BrandeisBrand">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6">
          <Logo color={"white"} />
        </div>
        <div className="mt-8  md:mt-0">
          <p className="text-center text-xs leading-5 text-white">
            &copy; {currentYear} Startup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
