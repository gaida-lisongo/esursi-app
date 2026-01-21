"use client";

import React, { useEffect, useState } from "react";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { getProvinces } from "@/lib/actions/personnels/province/getProvinces";
import { getEtablissementsByProvince } from "@/lib/actions/finance/reportingActions";
import Spinner from "@/components/ui/Spinner";
import { useAdminStore } from "@/store/useAdminStore";

export default function DashboardData() {
    const { user, etabsUser } = useAdminStore();
    const [provinces, setProvinces] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getProvinces();

                if (res.success && res.data) {
                    const provincesWithEtabs = [];

                    for (const province of res.data) {
                        const etabs = await getEtablissementsByProvince(province.id);
                        provincesWithEtabs.push({
                            ...province,
                            etabs: etabs.success && etabs.data ? etabs.data : []
                        });
                    }

                    setProvinces(provincesWithEtabs);
                }
            } catch (err) {
                console.error("Error fetching provinces:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement des données...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <EcommerceMetrics data={etabsUser ?? []} />
            <MonthlySalesChart data={etabsUser ?? []} />
        </>
    );
}
