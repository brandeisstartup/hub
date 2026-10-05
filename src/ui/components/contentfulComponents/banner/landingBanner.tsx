import Link from "next/link";
import { useEffect, useState } from "react";

export type LandingBannerContent = {
  overlayTitle?: string;
  overlayLinkTitle?: string;
  overlayLink?: string;
  overlayEndDate?: string;
};

type LandingBannerProps = {
  content: LandingBannerContent;
};

const LandingBanner = ({ content }: LandingBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(
      window.localStorage.getItem("landingBannerDismissed") === "true"
    );
  }, []);

  if (!content.overlayTitle) {
    return null;
  }

  if (content.overlayEndDate) {
    const endDate = /^\d{4}-\d{2}-\d{2}$/.test(content.overlayEndDate)
      ? new Date(`${content.overlayEndDate}T23:59:59.999`)
      : new Date(content.overlayEndDate);

    if (Number.isNaN(endDate.getTime()) || Date.now() > endDate.getTime()) {
      return null;
    }
  }

  if (isDismissed) {
    return null;
  }

  const dismissBanner = () => {
    window.localStorage.setItem("landingBannerDismissed", "true");
    setIsDismissed(true);
  };
  const overlayLinkTitle = content.overlayLinkTitle?.replace(/\s*→\s*$/, "");

  return (
    <section
      className="absolute left-0 right-0 top-20 z-20 flex justify-center bg-gradient-to-r from-BrandeisBrand to-black px-4 py-12 font-sans text-white shadow-[0_18px_32px_rgba(0,0,0,0.7)] md:px-8"
      aria-labelledby="landing-banner-title">
      <button
        type="button"
        onClick={dismissBanner}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-3 text-2xl leading-none text-white transition hover:opacity-70">
        &times;
      </button>
      <div className="flex w-full max-w-6xl flex-col items-start justify-center gap-6 px-2 text-left sm:px-4 md:flex-row md:items-center md:justify-between md:gap-10 md:px-6">
        <p
          id="landing-banner-title"
          className="min-w-0 max-w-4xl break-words text-3xl font-bold leading-tight md:text-5xl">
          {content.overlayTitle}
        </p>
        {overlayLinkTitle && content.overlayLink && (
          <Link
            href={content.overlayLink}
            className="shrink-0 self-end border-b-2 border-white px-2 pb-1 text-xl font-medium transition hover:opacity-70 md:ml-auto md:self-auto md:text-2xl">
            {overlayLinkTitle} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </section>
  );
};

export default LandingBanner;
