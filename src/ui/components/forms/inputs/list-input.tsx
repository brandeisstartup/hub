// @ts-nocheck
import React from "react";
import {
  FieldError,
  RegisterOptions,
  Path,
  ArrayPath,
  useFieldArray,
  useFormContext
} from "react-hook-form";

export interface ListInputProps<
  TFieldValues extends Record<string, any> = Record<string, any>
> {
  label: string;
  /** The name of the field should be an array field in your form values. */
  name: ArrayPath<TFieldValues>;
  required?: boolean;
  options?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: FieldError;
}

export const ListInput = <
  TFieldValues extends Record<string, any> = Record<string, any>
>({
  label,
  name,
  required = false,
  options = {},
  error
}: ListInputProps<TFieldValues>) => {
  // Use the form context to get control and register
  const { control, register } = useFormContext<TFieldValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  return (
    <div className="flex flex-col gap-1 font-sans">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <input
              type="email"
              {...register(
                `${name}.${index}` as Path<TFieldValues>,
                options as RegisterOptions<TFieldValues, Path<TFieldValues>>
              )}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-2 py-1 bg-red-500 text-white rounded">
              Remove
            </button>
          </div>
        ))}
      </div>
      {/* @ts-ignore */}
      <button
        type="button"
        onClick={() => append("")}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Add Item
      </button>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default ListInput;
