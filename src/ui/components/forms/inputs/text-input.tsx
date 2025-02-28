// components/TextInput.tsx
import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface TextInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  /** If true, automatically make the field required. */
  required?: boolean;
  /** Optional register options, merged with the required rule if `required` is true. */
  options?: RegisterOptions<any, any>;
}

export const TextInput = ({
  label,
  name,
  register,
  error,
  placeholder = "",
  type = "text",
  required = false,
  options = {}
}: TextInputProps) => {
  // Merge required rule if `required` prop is true
  if (required && !options.required) {
    options.required = `${label || "This field"} is required`;
  }

  return (
    <div className="flex flex-col gap-1 font-sans">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, options)}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default TextInput;
