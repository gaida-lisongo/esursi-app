"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEtablissementsByProvince, getProvinceDetails } from "@/lib/actions/finance/reportingActions";
import CardCrudManager from "@/components/common/CardCrudManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowUpIcon, TableIcon, PieChartIcon, GroupIcon, DownloadIcon, CloseLineIcon, LockIcon } from "@/icons";
import FinanceDashboard from "@/components/etablissement/Dashboard";
import { getAnnees } from "@/lib/actions/education/anneeActions";
import { getBudgetsByAnneeEtab, getFraisByAnnee, getParcoursByAnneeEtab, getTransactionsByFrais } from "@/lib/actions/finance/fraisActions";

export default function ProvinceReportingPage() {
    const { provinceId } = useParams();
    const router = useRouter();
    const [etablissements, setEtablissements] = useState<any[]>([]);
    const [province, setProvince] = useState<any>(null);
    const [selectedEtab, setSelectedEtab] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [annees, setAnnees] = useState<any[]>([]);
    const [parcours, setParcours] = useState<any[]>([]);
    const [budget, setBudget] = useState<any | null>(null);
    const [metriques, setMetriques] = useState<any[]>([]);

    //Fetch data from Server Action
    const loadDashboardData = async (etab: any) => {
        if (!etab) return;
        setDashboardLoading(true);
        try {
            const resAnnees = await getAnnees();
            if (resAnnees.success) {
                const data = resAnnees.data;
                const years = await Promise.all(data.map(async (annee: any) => {
                    let transaction: { _id: any; annee: string; actif: boolean; data: any[] } = {
                        _id: annee?._id,
                        annee: annee?.debut + " - " + annee?.fin,
                        actif: annee?.actif,
                        data: [],
                    };

                    if (annee.actif) {
                        const [resP, resB] = await Promise.all([
                            getParcoursByAnneeEtab(annee?._id, etab._id),
                            getBudgetsByAnneeEtab(annee?._id, etab._id),
                        ]);
                        if (resP.success) setParcours(resP.data || []);
                        if (resB.success) setBudget(resB.data);
                    }

                    const reqFrais = await getFraisByAnnee(annee?._id);
                    if (reqFrais.success && reqFrais.data?.length > 0) {
                        const allTransactions = await Promise.all(
                            reqFrais.data.map((f: any) => getTransactionsByFrais(f._id))
                        );
                        allTransactions.forEach((res) => {
                            if (res.success && res.data) {
                                transaction.data.push(...res.data);
                            }
                        });
                    }
                    return transaction;
                }));
                setAnnees(years);

                // Calculate metrics immediately
                const currentAnnee = years.find((annee: any) => annee.actif);
                if (currentAnnee) {
                    const paimemntsOK = currentAnnee?.data?.filter((t: any) => t.status === "OK") || [];
                    const paimemntsPENDING = currentAnnee?.data?.filter((t: any) => t.status === "PENDING") || [];
                    const paimemntsNO = currentAnnee?.data?.filter((t: any) => t.status === "NO") || [];

                    const stats: any[] = [
                        {
                            icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
                            title: "Paiements collectés",
                            value: paimemntsOK.reduce((total: number, item: any) => total + item.montant, 0),
                            proportion: paimemntsOK.length / (paimemntsOK.length + paimemntsPENDING.length + paimemntsNO.length) || 0,
                            annee: currentAnnee.annee,
                            status: "up",
                        },
                        {
                            icon: <DownloadIcon className="text-gray-800 size-6 dark:text-white/90" />,
                            title: "Paiements encours",
                            value: paimemntsPENDING.reduce((total: number, item: any) => total + item.montant, 0),
                            proportion: paimemntsPENDING.length / (paimemntsOK.length + paimemntsPENDING.length + paimemntsNO.length) || 0,
                            annee: currentAnnee.annee,
                            status: "down",
                        },
                        {
                            icon: <LockIcon className="text-gray-800 size-6 dark:text-white/90" />,
                            title: "Paiements non collectés",
                            value: paimemntsNO.reduce((total: number, item: any) => total + item.montant, 0),
                            proportion: paimemntsNO.length / (paimemntsOK.length + paimemntsPENDING.length + paimemntsNO.length) || 0,
                            annee: currentAnnee.annee,
                            status: "down",
                        },
                    ];
                    setMetriques(stats);
                }
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setDashboardLoading(false);
        }
    };

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
    }, [provinceId]);

    useEffect(() => {
        if (selectedEtab) {
            loadDashboardData(selectedEtab);
        }
    }, [selectedEtab]);

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
                    isLoading={dashboardLoading}
                    metriques={metriques}
                    budget={budget}
                    parcours={parcours}
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
