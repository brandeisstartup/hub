"use client";
import { Menu } from "@headlessui/react";
import { useMergedUser } from "@/context/UserContext";
import React from "react";

interface UserDropdownProps {
  children: React.ReactNode;
}

export default function UserDropdown({ children }: UserDropdownProps) {
  const { user } = useMergedUser();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        )}
      </Menu.Button>
      {/* Increase the width here from w-48 to w-64 (or use min-w-[16rem]) */}
      <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {/* Permanent header with merged user info and avatar */}
          <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {user && (user.firstName || user.lastName)
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                  : "User"}
              </div>
              {/* Truncate the email on one line if it's too long */}
              <div className="text-xs text-gray-600 truncate overflow-hidden whitespace-nowrap">
                {user?.email}
              </div>
            </div>
          </div>
          {/* Additional dropdown items */}
          {children}
        </div>
      </Menu.Items>
    </Menu>
  );
}
