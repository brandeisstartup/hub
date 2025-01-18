import { Hind, Merriweather } from "next/font/google";

export const hind = Hind({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hind"
});

export const merriweather = Merriweather({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather"
});
