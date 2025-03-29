import { Menu } from "@headlessui/react";
import Link from "next/link";

interface DropDownItemProps {
  link: string;
  name: string;
  description?: string;
}

export default function UserDropDownItem({
  link,
  name,
  description
}: DropDownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={link}
          className={`${
            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
          } block px-4 py-2 text-sm`}>
          <div className="font-medium">{name}</div>
          {description && (
            <div className="mt-1 text-xs text-gray-500">{description}</div>
          )}
        </Link>
      )}
    </Menu.Item>
  );
}
