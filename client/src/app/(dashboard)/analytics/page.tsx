"use client";

import { useEffect, useState } from "react";
import { getOrganizations } from "../../../services/organization-service";

const AnalyticsPage = () => {
  const [organizationCount, setOrganizationCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const organizations = await getOrganizations();
        setOrganizationCount(organizations.length);
      } catch {
        setOrganizationCount(0);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Analytics Overview</h1>
      <p className="text-sm text-gray-600">
        Backend-connected summary: {organizationCount} organization(s) loaded.
      </p>
    </div>
  );
};

export default AnalyticsPage;
