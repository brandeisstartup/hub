import React, { useState } from "react";

const Avatar = ({ imageUrl }: { imageUrl?: string }) => {
  const [imgError, setImgError] = useState(false);

  return imageUrl && !imgError ? (
    <img
      src={imageUrl}
      alt="User avatar"
      className="h-8 w-8 rounded-full object-cover border-2 border-white"
      onError={() => setImgError(true)}
    />
  ) : (
    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
  );
};

export default Avatar;
