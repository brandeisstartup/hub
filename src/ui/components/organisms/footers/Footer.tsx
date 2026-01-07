import Logo from "@/ui/components/molecules/logo/logo";
import Link from "next/link";

function getCurrentYear() {
  return new Date().getFullYear();
}
const currentYear = getCurrentYear();

export default function Footer() {
  return (
    <footer className="bg-[#58595b] px-2 ">
      <div className="mx-auto max-w-8xl px-6 py-12 md:px-2 md:flex lg:flex-row  md:items-start md:justify-between ">
        <div className="flex  space-x-6">
          <Logo color={"white"} />
        </div>
        <div className="pt-2 md:mt-0">
          <p className=" text-lg font-bold leading-5 text-white border-b-4 border-b-[#797a7c]">
            Entrepreneurship & Collaboration
          </p>
          <ul>
            <li className=" text-xs leading-5 text-white">
              <Link href={"/"}>Home</Link>
            </li>
            <li className=" text-xs leading-5 text-white">
              <Link href={"/#about"}>About</Link>
            </li>
            <li className=" text-xs leading-5 text-white">
              <Link href={"/#events"}>Events</Link>
            </li>
            <li className=" text-xs leading-5 text-white">
              <Link href={"/search"}>Projects</Link>
            </li>
          </ul>
        </div>
        <div className="pt-2 md:mt-0">
          <p className=" text-lg font-bold leading-5 text-white border-b-4 border-b-[#797a7c]">
            Contact Us
          </p>
          <ul>
            <li className=" text-xs leading-5 text-white">
              Brandeis University <br />
              415 South Street Waltham, MA <br />
              02453
            </li>
            <li className=" text-xs leading-5 text-white">
              <a href="mailto:pwells@brandeis.edu">pwells@brandeis.edu</a>
            </li>
            <li className=" text-xs leading-5 text-white">
              <a href="mailto:brandeisstartup@gmail.com">brandeisstartup@gmail.com</a>
            </li>
          </ul>
        </div>

        <div className="pt-2 md:mt-0">
          <p className=" text-lg font-bold leading-5 text-white border-b-4 border-b-[#797a7c]">
            Connect with us
          </p>
          <ul>
            <li className=" text-xs leading-5 text-white">
              <a
                href={"https://www.youtube.com/@BrandeisStartupHub"}
                target="_blank">
                Youtube Channel
              </a>
            </li>
            {/* <li className=" text-xs leading-5 text-white">
              <Link href={"/"}>Startup Hub Google Calendar Link</Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-8xl px-6 py-6 md:px-2 flex flex-col sm:flex-row justify-between border-t border-t-[#797a7c]">
        <div className="mt-0">
          <p className=" text-xs leading-5 text-white">
            &copy; {currentYear} Brandeis Entrepreneurship and Collaboration Hub
          </p>
        </div>
        <div className="mt-0">
          <Link href={"/#about"} className=" text-xs leading-5 text-white">
            {" "}
            About
          </Link>
        </div>
        <div className="mt-0">
          <Link href={"/legal/terms"} className=" text-xs leading-5 text-white">
            {" "}
            Terms of Service
          </Link>
        </div>
        <div className="mt-0">
          <Link
            href={"/legal/privacy"}
            className=" text-xs leading-5 text-white">
            {" "}
            Privacy Statement
          </Link>
        </div>

        {/* https://www.brandeis.edu/emergency/ */}
      </div>
    </footer>
  );
}
