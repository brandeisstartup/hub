import React from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Link from "next/link";
import { Person } from "@/types/used/CompetitionTypes";

type Props = {
  label: string;
  sectionBlurb: string;
  contacts: Person[];
};

const ContactInfo = ({ label, sectionBlurb, contacts }: Props) => {
  console.log(contacts);
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-8xl px-6 lg:px-4">
        <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <Heading label={label} />
              <p className="text-center md:text-left mt-4 leading-7 text-gray-600">
                {sectionBlurb}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              {contacts.map((contact, index) => (
                <div
                  key={`${contact.fields.firstName}-${index}`}
                  className="rounded-2xl  bg-gray-50 p-10">
                  <h3 className="text-base font-sans font-semibold leading-7 text-gray-900">
                    {contact.fields.lastName} {contact.fields.firstName}
                  </h3>
                  {contact.fields.email && (
                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                      <div>
                        <dt className="sr-only">Email</dt>
                        <dd>
                          <Link
                            className="font-semibold text-blue-600"
                            href={`mailto:${contact.fields.email}`}>
                            {contact.fields.email}
                          </Link>
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
