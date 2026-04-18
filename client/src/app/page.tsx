import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Multi-tenant SaaS
        </span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Task Management Platform
        </h1>
        <p className="mt-3 text-gray-600">
          Manage organizations, projects, and tasks with a clean dashboard
          experience.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-blue-200 px-4 py-2 text-blue-700 hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
