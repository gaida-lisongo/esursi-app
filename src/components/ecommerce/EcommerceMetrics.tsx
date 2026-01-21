import React from "react";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics({
  data
}: { data: any[] }) {

  const totalProvinces = data?.reduce((acc, role) => acc + (role.etablissements.length > 0 ? 1 : 0), 0);
  const totalEtablissements = data?.reduce((acc, role) => acc + role.etablissements.length, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Provinces Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Comité de Gestion
            </span>
            <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {totalProvinces}
            </h4>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
            <svg
              className="w-7 h-7 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <Badge>
            Actives
          </Badge>
        </div>
      </div>

      {/* Établissements Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Établissements
            </span>
            <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {totalEtablissements}
            </h4>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-500/10">
            <svg
              className="w-7 h-7 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total national
          </span>
        </div>
      </div>
    </div>
  );
}
