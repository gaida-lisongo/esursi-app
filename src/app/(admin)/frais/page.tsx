"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CardCrudManager from "@/components/common/CardCrudManager";
import CrudManager from "@/components/common/CrudManager";
import { getAnnees } from "@/lib/actions/education/anneeActions";
import { getFraisByAnnee } from "@/lib/actions/finance/fraisActions";
import { FraisForm, DeleteFraisForm } from "@/components/finance/FraisForms";
import { ManageQuotasModal } from "@/components/finance/ManageQuotasModal";
import { useNotification } from "@/context/NotificationContext";
import { ArrowUpIcon, TableIcon, CalenderIcon, ListIcon } from "@/icons";

export default function FraisPage() {
    const [annees, setAnnees] = useState<any[]>([]);
    const [selectedAnnee, setSelectedAnnee] = useState<any>(null);
    const [frais, setFrais] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [manageFrais, setManageFrais] = useState<any>(null); // For Quotas modal
    const { showNotification } = useNotification();

    const loadAnnees = async () => {
        setLoading(true);
        const res = await getAnnees();
        if (res.success) setAnnees(res.data);
        setLoading(false);
    };

    const loadFrais = async (anneeId: string) => {
        setLoading(true);
        const res = await getFraisByAnnee(anneeId);
        if (res.success) setFrais(res.data);
        setLoading(false);
    };

    useEffect(() => { loadAnnees(); }, []);

    useEffect(() => {
        if (selectedAnnee) loadFrais(selectedAnnee.id);
    }, [selectedAnnee]);

    if (!selectedAnnee) {
        return (
            <div className="container mx-auto pb-10">
                <PageBreadcrumb pageTitle="Finance - Frais Académiques" />
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Sélectionner une Année</h2>
                    <p className="text-sm text-gray-500">Choisissez une année académique pour gérer ses frais.</p>
                </div>

                <CardCrudManager
                    title="Années Académiques"
                    header={["debut", "fin", "description"]}
                    items={annees}
                    isLoading={loading}
                    searchKeys={["debut", "fin"]}
                    customActions={(item) => (
                        <button
                            onClick={() => setSelectedAnnee(item)}
                            className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all"
                        >
                            <ArrowUpIcon className="w-5 h-5 rotate-90" />
                        </button>
                    )}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <PageBreadcrumb pageTitle={`Frais ${selectedAnnee.debut}-${selectedAnnee.fin}`} />

            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setSelectedAnnee(null)}
                    className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-blue-600 transition-all shadow-sm"
                >
                    <ArrowUpIcon className="w-5 h-5 -rotate-90" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Gestion des Frais</h2>
                    <p className="text-sm text-gray-500 uppercase font-black tracking-widest text-blue-600">Année Académique {selectedAnnee.debut}-{selectedAnnee.fin}</p>
                </div>
            </div>

            <CrudManager
                title="Tableau des Frais"
                header={["designation", "categorie", "montant", "repartitionCount"]}
                items={frais}
                isLoading={loading}
                searchKeys={["designation", "categorie"]}
                CreateForm={({ onClose }) => <FraisForm anneeId={selectedAnnee.id} onClose={() => { onClose(); loadFrais(selectedAnnee.id); }} />}
                UpdateForm={({ item, onClose }) => <FraisForm item={item} anneeId={selectedAnnee.id} onClose={() => { onClose(); loadFrais(selectedAnnee.id); }} />}
                DeleteForm={({ item, onClose }) => <DeleteFraisForm item={item} onClose={() => { onClose(); loadFrais(selectedAnnee.id); }} />}
                customActions={(item) => (
                    <button
                        onClick={() => setManageFrais(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                        title="Clé de Répartition"
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                )}
            />

            {/* Modals */}
            {manageFrais && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <ManageQuotasModal
                        frais={manageFrais}
                        onClose={() => { setManageFrais(null); loadFrais(selectedAnnee.id); }}
                    />
                </div>
            )}
        </div>
    );
}
