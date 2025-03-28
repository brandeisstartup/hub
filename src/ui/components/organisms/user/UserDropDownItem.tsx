import { Menu } from "@headlessui/react";

interface DropDownItemProps {
  link: string;
  name: string;
}

export function UserDropDownItem({ link, name }: DropDownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={link}
          className={`${
            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
          } block px-4 py-2 text-sm`}>
          {name}
        </a>
      )}
    </Menu.Item>
  );
}
