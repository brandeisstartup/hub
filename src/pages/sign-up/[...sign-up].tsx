import React from "react";
import { SignUp } from "@clerk/nextjs";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex justify-center p-5">
      {" "}
      <SignUp />
    </div>
  );
};

export default page;
