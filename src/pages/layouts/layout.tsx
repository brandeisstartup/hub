import type { ReactNode } from "react";

import { hind, merriweather } from "@/fonts/fonts";
import Nav from "@/ui/components/organisms/nav";
import Footer from "@/ui/components/organisms/footers/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`${hind.variable} font-sans`}>
      <Nav />
      <main className={`${merriweather.variable} font-serif z-2`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
