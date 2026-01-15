"use client";

import React, { useEffect, useState } from "react";
import { getProvinces } from "@/lib/actions/personnels/province/getProvinces";
import CardCrudManager from "@/components/common/CardCrudManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowUpIcon } from "@/icons";
import { useRouter } from "next/navigation";

export default function ReportingPage() {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const res = await getProvinces();
            console.log("Province fetched : ", res.data);
            if (res.success && res.data) setProvinces(res.data);
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle="Finance - Suivi & Reporting" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Reporting par Province</h2>
                <p className="text-sm text-gray-500">Sélectionnez une province pour consulter les indicateurs financiers des établissements.</p>
            </div>

            <CardCrudManager
                title="Provinces"
                header={["code", "designation"]}
                items={provinces}
                isLoading={loading}
                searchKeys={["code"]}
                customActions={(item) => (
                    <button
                        onClick={() => router.push(`/reporting/${item.id}`)}
                        className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-4 text-xs font-bold"
                    >
                        <span>Ouvrir</span>
                        <ArrowUpIcon className="w-4 h-4 rotate-90" />
                    </button>
                )}
            />
        </div>
    );
}
