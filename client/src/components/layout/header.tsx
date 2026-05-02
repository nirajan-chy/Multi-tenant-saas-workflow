import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 text-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <h1 className="text-xl font-bold">Task Management</h1>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/tasks" className="hover:text-gray-900">
            Tasks
          </Link>
          <Link href="/projects" className="hover:text-gray-900">
            Organizations
          </Link>
          <Link href="/teams" className="hover:text-gray-900">
            Teams
          </Link>
          <Link href="/analytics" className="hover:text-gray-900">
            Analytics
          </Link>
          <Link href="/settings" className="hover:text-gray-900">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
