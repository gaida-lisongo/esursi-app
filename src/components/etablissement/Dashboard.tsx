import type { Metadata } from "next";
import React from "react";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { Metrics } from "../ecommerce/Metrics";
import RevenuChart from "../ecommerce/RevenuChart";
import TargetChart from "../ecommerce/TargetChart";

import { DecaissementCarousel } from "../finance/DecaissementCarousel";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function FinanceDashboard() {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-3">
                <Metrics data={[1, 2, 3]} />

            </div>

            <div className="col-span-12 flex flex-col lg:flex-row gap-3">
                <div className="lg:w-2/3 space-y-3">
                    <RevenuChart />
                    <DecaissementCarousel />
                </div>
                <div className="lg:w-1/3">
                    <TargetChart />
                </div>
            </div>

            <div className="col-span-12 ">
                <RecentOrders />
            </div>
        </div>
    );
}
