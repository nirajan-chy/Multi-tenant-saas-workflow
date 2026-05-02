import React from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white px-4 py-6">
      <nav className="space-y-2 text-sm font-medium text-gray-700">
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/tasks"
        >
          Tasks
        </Link>
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/projects"
        >
          Organizations
        </Link>
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/teams"
        >
          Teams
        </Link>
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/analytics"
        >
          Analytics
        </Link>
        <Link
          className="block rounded-lg px-3 py-2 hover:bg-gray-100"
          href="/settings"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
