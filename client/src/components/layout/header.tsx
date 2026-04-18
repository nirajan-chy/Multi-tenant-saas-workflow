import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="hover:underline">
                Tasks
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/teams" className="hover:underline">
                Teams
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:underline">
                Analytics
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
