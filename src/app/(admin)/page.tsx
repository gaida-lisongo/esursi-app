import type { Metadata } from "next";
import React from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DashboardData from "@/components/ecommerce/DashboardData";

export const metadata: Metadata = {
  title: "Dashboard | ESURSI-APP",
  description: "Tableau de bord de suivi des établissements d'enseignement supérieur en RDC",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <DashboardData />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <Metrics />
      </div> */}

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-6">
        <AgentsPage />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <AnneesPage />
      </div> */}
    </div>
  );
}
