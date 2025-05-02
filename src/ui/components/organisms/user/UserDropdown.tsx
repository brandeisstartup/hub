"use client";

import { Menu } from "@headlessui/react";
import { useMergedUser } from "@/context/UserContext";
import React from "react";
import Avatar from "./Avatar";
import UserDropDownItem from "./UserDropDownItem";

interface UserDropdownProps {
  children?: React.ReactNode;
}

export default function UserDropdown({ children }: UserDropdownProps) {
  const { user } = useMergedUser();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        {user?.imageUrl ? (
          <Avatar imageUrl={user.imageUrl} />
        ) : (
          // avatar skeleton
          <div className="rounded-full bg-gray-300 h-8 w-8 animate-pulse" />
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {/* Header with user info or skeleton */}
          {user ? (
            <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200">
              <Avatar imageUrl={user.imageUrl!} />
              <div className="flex-1">
                <div className="text-lg font-bold text-BrandeisBrand break-words">
                  {user.firstName || user.lastName
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                    : "User"}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200">
              {/* avatar skeleton */}
              <div className="rounded-full bg-gray-300 h-10 w-10 animate-pulse" />
              {/* text skeleton */}
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          )}

          {/* Dropdown Items */}
          <UserDropDownItem
            link="/user/my-projects"
            name="My Projects"
            description="View your projects and contributions"
          />
          <UserDropDownItem
            link="/user/edit-profile"
            name="Edit Profile"
            description="Manage your personal information"
          />

          {children}
        </div>
      </Menu.Items>
    </Menu>
  );
}
