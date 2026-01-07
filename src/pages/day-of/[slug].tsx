import { GetStaticPaths, GetStaticProps } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: false };
};

export const getStaticProps: GetStaticProps = async () => {
  return { notFound: true };
};

export default function DeprecatedDayOfPage() {
  return null;
}
