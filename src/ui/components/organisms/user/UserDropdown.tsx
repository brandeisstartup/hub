"use client";
import { Menu } from "@headlessui/react";
import { useMergedUser } from "@/context/UserContext";

export default function UserDropdown() {
  const { user } = useMergedUser();

  return (
    <Menu as="div" className="relative inline-block text-left ">
      <Menu.Button className="flex items-center focus:outline-none ">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover border-2 border-white "
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 font-medium">U</span>
          </div>
        )}
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                href="/profile"
                className={`${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                } block px-4 py-2 text-sm`}>
                Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="/settings"
                className={`${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                } block px-4 py-2 text-sm`}>
                Settings
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="/signout"
                className={`${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                } block px-4 py-2 text-sm`}>
                Sign Out
              </a>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
