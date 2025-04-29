import React from "react";
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
  Path
} from "react-hook-form";

export interface TextInputProps<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
> {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  /** If true, automatically make the field required. */
  required?: boolean;
  /** Optional register options, merged with the required rule if `required` is true. */
  options?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  /** Optional regex pattern to validate input, with custom message. */
  pattern?: RegExp;
  patternMessage?: string;
}

export const TextInput = <
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
>({
  label,
  name,
  register,
  error,
  placeholder = "",
  type = "text",
  required = false,
  pattern,
  patternMessage,
  options = {}
}: TextInputProps<TFieldValues>) => {
  // Merge required rule if `required` prop is true and not already provided.
  if (required && !options.required) {
    options.required = `${label || "This field"} is required`;
  }

  // Merge regex pattern rule if provided and not already in options.
  if (pattern && !options.pattern) {
    options.pattern = {
      value: pattern,
      message: patternMessage || `${label || "This field"} is invalid`
    };
  }

  return (
    <div className="flex flex-col gap-1 font-sans">
      <label
        htmlFor={name as string}
        className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name as string}
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
