"use client";

import React from 'react'
import ListItem from './ListItem';
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { title: "Train Allocation", icon: "home", path: "/dashboard" },
  { title: "Upload", icon: "upload", path: "/dashboard/upload" },
  { title: "Simulations", icon: "simulations", path: "/dashboard/simulations" },
  { title: "Maintenance", icon: "maintenance", path: "/dashboard/maintenance" },
  { title: "Cleaning", icon: "cleaning", path: "/dashboard/cleaning" },
  { title: "Admin", icon: "admin", path: "/dashboard/admin" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <ul className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link, index) => {
          // ✅ Special case: allocation active on both /dashboard and /dashboard/allocation
          const isActive =
            link.path === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/dashboard/allocation")
              : pathname.startsWith(link.path);

          return (
            <li key={index}>
              <ListItem
                title={link.title}
                icon={link.icon}
                path={link.path}
              />

            </li>
          );
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
