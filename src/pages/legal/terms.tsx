import React from "react";

const terms = () => {
  return (
    <div className="flex justify-center items-center flex-col p-10">
      <div className="max-w-5xl flex flex-col gap-4 font-sans py-5 mt-10">
        <div className="max-w-7xl ">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Brandeis Startup Hub</h1>
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

        <h2 className="font-bold text-3xl md:text-4xl mt-8 mb-4">Terms of Service</h2>
        <p>
          <strong>Effective Date:</strong> April 5, 2025
        </p>

        <div>
          {" "}
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">1. Introduction</h3>
          <p>
            Welcome to Brandeis Startup Hub (“we,” “us,” or “our”). These Terms
            of Service (“Terms”) govern your use of our website that displays
            events, hackathons, competitions, and user-submitted projects for
            students at Brandeis University in Waltham, MA (“Service”). By
            accessing or using our Service, you agree to these Terms. If you do
            not agree, please do not use the Service.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">2. Eligibility</h3>
          <p>
            The Service is available to students and other authorized users who
            meet our eligibility requirements. By using our Service, you
            represent that you are a student at Brandeis or an eligible
            participant and will abide by these Terms.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">
            3. Account Registration and User Information
          </h3>
          <ul>
            <li>
              <strong>Registration:</strong> To submit projects or create a
              profile, you must register for an account and provide information
              including your name, email address, profile image, user-entered
              bio, major, and academic year.
            </li>
            <li>
              <strong>Accuracy:</strong> You agree to provide accurate, current,
              and complete information and update it as necessary.
            </li>
            <li>
              <strong>Account Deletion:</strong> You may delete your profile and
              any submitted projects at any time through your account settings.
              Deleting your profile removes your personal information and any
              associated submissions from our active systems.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">4. User-Submitted Content</h3>
          <ul>
            <li>
              <strong>Project Submission:</strong> You may submit projects for
              display on our website. You retain ownership of all submitted
              content.
            </li>
            <li>
              <strong>Grant of License:</strong> By submitting a project, you
              grant us a non-exclusive, worldwide, royalty-free license to use,
              display, reproduce, and distribute your content solely for the
              operation and promotion of the Service.
            </li>
            <li>
              <strong>Voluntary Submission and Deletion:</strong> Submission of
              projects is voluntary, and you may opt out at any time by deleting
              your projects or account.
            </li>
            <li>
              <strong>Content Guidelines:</strong> You agree not to submit
              content that is unlawful, infringing, or harmful. We reserve the
              right to remove any content that violates these Terms or our
              community guidelines.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">5. Intellectual Property</h3>
          <p>
            All content provided by us (except user-submitted content) is our
            property or that of our licensors and is protected by intellectual
            property laws. You may not reproduce or distribute any part of the
            Service without our express written consent.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">6. Use of the Service</h3>
          <ul>
            <li>
              <strong>Permitted Use:</strong> You may use our Service only for
              lawful purposes and in accordance with these Terms.
            </li>
            <li>
              <strong>User Responsibilities:</strong> You are responsible for
              maintaining the confidentiality of your account information and
              all activities conducted through your account.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">
            7. Disclaimers and Limitations of Liability
          </h3>
          <ul>
            <li>
              <strong>Disclaimer of Warranties:</strong> The Service is provided
              on an “as is” and “as available” basis without warranties of any
              kind, either express or implied. We do not guarantee uninterrupted
              or error-free operation.
            </li>
            <li>
              <strong>Limitation of Liability:</strong> In no event shall
              Brandeis Startup Hub be liable for any indirect, incidental,
              consequential, or punitive damages arising from your use of the
              Service.
            </li>
          </ul>
        </div>
        <div>
          {" "}
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">8. Modifications</h3>
          <p>
            We may modify these Terms from time to time. We will update this
            page with a new effective date. Your continued use of the Service
            constitutes your acceptance of the modified Terms.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">
            9. Governing Law and Dispute Resolution
          </h3>
          <p>
            These Terms shall be governed by the laws of the Commonwealth of
            Massachusetts. Any disputes shall be subject to the exclusive
            jurisdiction of the courts located in Massachusetts.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-xl md:text-2xl mt-6 mb-2">10. Contact Information</h3>
          <p>
            If you have any questions about these Terms, please contact us at:
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

export default terms;
