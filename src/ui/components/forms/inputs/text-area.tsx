// components/LongTextInput.tsx
import React from "react";
import {
  FieldError,
  RegisterOptions,
  UseFormRegister,
  Path
} from "react-hook-form";

export interface LongTextInputProps<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
> {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  /** Number of rows for the textarea */
  rows?: number;
  required?: boolean;
  options?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}

export const LongTextInput = <
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
>({
  label,
  name,
  register,
  error,
  placeholder = "",
  rows = 4,
  required = false,
  options = {}
}: LongTextInputProps<TFieldValues>) => {
  if (required && !options.required) {
    options.required = `${label || "This field"} is required`;
  }

  return (
    <div className="flex flex-col gap-1 font-sans">
      <label
        htmlFor={name as string}
        className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={name as string}
        placeholder={placeholder}
        rows={rows}
        {...register(name, options)}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}></textarea>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default LongTextInput;
