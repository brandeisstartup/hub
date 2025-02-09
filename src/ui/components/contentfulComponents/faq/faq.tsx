import React from "react";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { Person } from "@/types/used/CompetitionTypes";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  label: string;
  faqs: Array<{ question: string; answer: string }>;
};

const Faq = ({ label, faqs }: Props) => {
  return (
    <div className="bg-white" id="faq">
      <div className="mx-auto max-w-8xl px-6 py-24 sm:py-32 lg:px-4 lg:py-16">
        <div className="mx-auto max-w-8xl">
          <Heading label={label} />
          <dl className="mt-10 space-y-3 ">
            {faqs.map((faq, index) => (
              <Disclosure
                as="div"
                key={`${faq.question}-${faq.answer}-${index}`}
                className="pt-6 pb-6 px-5 bg-BrandeisBackgroundAlt">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="font-sans font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-8 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      {Array.isArray(faq.answer) ? (
                        faq.answer.map((item, index) => (
                          <p
                            key={`${item ?? "empty"}-${index}`}
                            className="text-base leading-7 text-gray-600 mb-2">
                            {index + 1}. {item}
                          </p>
                        ))
                      ) : (
                        <p className="text-base leading-7 text-gray-600">
                          {faq.answer}
                        </p>
                      )}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Faq;
