import React from "react";

const TermsPrivacy = () => {
  return (
    <div className="flex justify-center items-center flex-col p-10">
      <div className="max-w-5xl flex flex-col gap-4 font-sans py-5">
        <div className="max-w-7xl ">
          <h1>Brandeis Startup Hub</h1>
          <p>(Part of Brandeis University)</p>
          <p>
            <strong>Contact:</strong> Philippe Wells
          </p>
          <p>
            <strong>Email:</strong> pwells@brandeis.edu
          </p>
          <p>
            <strong>Address:</strong> 415 South Street, Waltham, MA 02453-2728
          </p>
        </div>

        <h2 className="font-semibold text-2xl">Privacy Policy</h2>
        <p>
          <strong>Effective Date:</strong> April 5, 2025
        </p>

        <div>
          <h3 className="font-semibold text-2xl">1. Introduction</h3>
          <p>
            This Privacy Policy explains how Brandeis Startup Hub (“we,” “us,”
            or “our”) collects, uses, and protects your personal information
            when you use our Service. By using the Service, you consent to the
            practices described in this policy.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">2. Information We Collect</h3>
          <ul className="list-disc pl-6">
            <li>
              <em>Account Information:</em> When you register, we collect your
              name, email address, profile image, user-entered bio, major, and
              academic year.
            </li>
            <li>
              <em>User-Submitted Content:</em> When you submit projects, we
              collect the data you provide for display purposes on our website.
            </li>
            <li>
              <em>Automatically Collected Data:</em> We may automatically
              collect information such as your IP address, browser type,
              operating system, and access times, along with cookies and similar
              tracking technologies via Google Analytics.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">
            3. How We Use Your Information
          </h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>To Provide the Service:</strong> We use your information
              to register you, enable project submissions, display events, and
              personalize your experience.
            </li>
            <li>
              <strong>Communication:</strong> Your email may be used to send you
              important notifications and updates related to your account or the
              Service.
            </li>
            <li>
              <strong>Analytics and Improvement:</strong> Data from cookies and
              Google Analytics is used solely for analyzing usage patterns and
              enhancing the Service.
            </li>
            <li>
              <strong>User Control:</strong> You can delete your profile and
              projects at any time, which will remove your personal information
              from our active systems.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">
            4. Data Sharing and Disclosure
          </h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Third-Party Service Providers:</strong> We may share your
              information with third parties (e.g., Google Analytics) to help us
              monitor and improve the Service.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required by law or in response to legal
              proceedings.
            </li>
            <li>
              <strong>No Sale of Personal Data:</strong> We do not sell or rent
              your personal information to any third parties.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">5. Data Security</h3>
          <p>
            We implement reasonable security measures to protect your data from
            unauthorized access and disclosure. However, no method of online
            transmission is entirely secure.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">
            6. Data Retention and User Rights
          </h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Retention:</strong> Your personal information is retained
              for as long as your account is active, or as needed to provide the
              Service.
            </li>
            <li>
              <strong>User Rights:</strong> You have the right to access,
              correct, or delete your personal information. You can manage your
              profile and submitted projects directly through the Service.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">
            7. Google Analytics and Cookies
          </h3>
          <p>
            We use Google Analytics to understand user interaction with our
            website. Google Analytics may set cookies and use similar tracking
            technologies. For further details on how Google handles data, please
            visit the Google Analytics Privacy & Terms page.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">
            8. Changes to This Privacy Policy
          </h3>
          <p>
            We may update this policy periodically. We will post any changes on
            this page with a revised effective date. Your continued use of the
            Service after the changes indicates your acceptance of the updated
            policy.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl">9. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> pwells@brandeis.edu
          </p>
          <p>
            <strong>Address:</strong> 415 South Street, Waltham, MA 02453-2728
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;
