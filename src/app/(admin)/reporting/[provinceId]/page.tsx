"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEtablissementsByProvince, getProvinceDetails } from "@/lib/actions/finance/reportingActions";
import CardCrudManager from "@/components/common/CardCrudManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowUpIcon, TableIcon, PieChartIcon } from "@/icons";
import FinanceDashboard from "@/components/etablissement/Dashboard";
import { getAnnees } from "@/lib/actions/education/anneeActions";
import { getFraisByAnnee, getTransactionsByFrais } from "@/lib/actions/finance/fraisActions";

export default function ProvinceReportingPage() {
    const { provinceId } = useParams();
    const router = useRouter();
    const [etablissements, setEtablissements] = useState<any[]>([]);
    const [province, setProvince] = useState<any>(null);
    const [selectedEtab, setSelectedEtab] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [annees, setAnnees] = useState<any[]>([]);

    //Fetch années from Server Action

    const loadAnnees = async () => {
        const resAnnees = await getAnnees();

        if (resAnnees.success) {
            const data = resAnnees.data;

            const years = data.map(async (annee: any) => {
                let transaction: { _id: any; annee: string; data: any[] } = {
                    _id: annee?._id,
                    annee: annee?.debut + ' - ' + annee?.fin,
                    data: []
                };

                let frais = [];
                const reqAnness = await getFraisByAnnee(annee?._id)
                if (reqAnness.success) {
                    const data = reqAnness.data;
                    frais = data;
                }

                if (frais?.length > 0) {
                    for (const f of frais) {
                        const reqTransactions = await getTransactionsByFrais(f?._id);

                        if (reqTransactions.success) {
                            const data = reqTransactions.data;

                            if (data) {
                                transaction.data.push(...data);
                            }
                        }
                    }
                }
                return transaction;
            });

            Promise.all(years).then((years) => {
                setAnnees(years);
            });
        };
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [resEtabs, resProv] = await Promise.all([
                getEtablissementsByProvince(provinceId as string),
                getProvinceDetails(provinceId as string)
            ]);
            if (resEtabs.success) setEtablissements(resEtabs.data);
            if (resProv.success) setProvince(resProv.data);
            setLoading(false);
        };
        load();
        loadAnnees();
    }, [provinceId]);

    if (selectedEtab) {
        return (
            <div className="container mx-auto pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <PageBreadcrumb pageTitle={`${selectedEtab.sigle} - Dashboard`} />

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedEtab(null)}
                        className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        <ArrowUpIcon className="w-5 h-5 -rotate-90" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedEtab.designation}</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Dashboard Financier</p>
                    </div>
                </div>

                <FinanceDashboard
                    metriques={[]}
                    budget={[]}
                    plansHebdo={[]}
                    parcours={[]}
                    transactions={annees}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto pb-10">
            <PageBreadcrumb pageTitle={province ? `Reporting - ${province.nom}` : "Chargement..."} />

            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push("/reporting")}
                    className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all shadow-sm"
                >
                    <ArrowUpIcon className="w-5 h-5 -rotate-90" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{province?.nom}</h2>
                    <p className="text-sm text-gray-500">Liste des établissements de la province.</p>
                </div>
            </div>

            <CardCrudManager
                title={`Établissements (${province?.nom})`}
                header={["sigle", "designation"]}
                items={etablissements}
                isLoading={loading}
                searchKeys={["sigle", "designation"]}
                customActions={(item) => (
                    <button
                        onClick={() => setSelectedEtab(item)}
                        className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-4 text-xs font-bold"
                    >
                        <span>Dashboard</span>
                        <PieChartIcon className="w-4 h-4" />
                    </button>
                )}
            />
        </div>
    );
}
