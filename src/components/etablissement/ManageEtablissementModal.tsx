"use client";

import React, { useEffect, useState } from "react";
import {
    getEtablissementFull,
    updateCOGE
} from "@/lib/actions/etablissement/actions";
import { getAgents } from "@/lib/actions/personnels/agent/actions";
import { useNotification } from "@/context/NotificationContext";
import Spinner from "@/components/ui/Spinner";
import {
    GroupIcon,
    CopyIcon,
    DocsIcon,
    CloseIcon,
    PlusIcon,
    TrashBinIcon,
    UserCircleIcon,
    ArrowRightIcon
} from "@/icons";

const SearchSVG = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const ManageEtablissementModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const [tab, setTab] = useState<"coge" | "refs" | "reports">("coge");
    const [details, setDetails] = useState<any>(null);
    const [allAgents, setAllAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { showNotification } = useNotification();

    const loadData = async () => {
        setLoading(true);
        const [resDetails, resAgents] = await Promise.all([
            getEtablissementFull(item.id),
            getAgents()
        ]);
        if (resDetails.success) setDetails(resDetails.data);
        if (resAgents.success) setAllAgents(resAgents.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleUpdateCOGE = async (newCoge: any[]) => {
        const res = await updateCOGE(item.id, newCoge);
        if (res.success) {
            showNotification("COGE mis à jour", "success");
            loadData();
        } else {
            showNotification(res.message, "error");
        }
    };

    const filteredAgents = allAgents.filter(a =>
        `${a.nom} ${a.prenom} ${a.matricule}`.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    if (loading) return <div className="p-20 flex justify-center bg-white dark:bg-gray-900 rounded-[2.5rem]"><Spinner size="lg" /></div>;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{details?.designation}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tab === "coge" ? "Comité de Gestion" : tab === "refs" ? "Références Documentaires" : "Rapports d'Activité"}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors"><CloseIcon className="w-5 h-5" /></button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-gray-50 dark:border-gray-800">
                <button onClick={() => setTab("coge")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "coge" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>COGE</button>
                <button onClick={() => setTab("refs")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "refs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>Références</button>
                <button onClick={() => setTab("reports")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "reports" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>Rapports</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {tab === "coge" && (
                    <div className="space-y-6">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><SearchSVG /></span>
                            <input
                                placeholder="Rechercher un agent pour le COGE..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 z-10 animate-in fade-in slide-in-from-top-2">
                                    {filteredAgents.length === 0 ? <p className="p-4 text-xs text-center text-gray-400">Aucun agent trouvé</p> : filteredAgents.map(a => (
                                        <button
                                            key={a.id}
                                            onClick={() => {
                                                handleUpdateCOGE([...(details.coge || []), { fonction: "Membre", agent: a.id }]);
                                                setSearchTerm("");
                                            }}
                                            className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-600">{a.nom[0]}{a.prenom[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold">{a.nom} {a.prenom}</p>
                                                <p className="text-[10px] text-gray-400">{a.matricule}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {details?.coge?.map((member: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-blue-100 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                                        {member.agent?.photo ? <img src={member.agent.photo} className="w-full h-full rounded-full object-cover" /> : <UserCircleIcon className="w-8 h-8 text-gray-300" />}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            defaultValue={member.fonction}
                                            onBlur={(e) => {
                                                const newCoge = [...details.coge];
                                                newCoge[idx].fonction = e.target.value;
                                                handleUpdateCOGE(newCoge);
                                            }}
                                            className="text-sm font-black bg-transparent border-none p-0 focus:ring-0 text-blue-600 w-full"
                                        />
                                        <p className="text-xs text-gray-500 font-bold">{member.agent?.nom} {member.agent?.prenom}</p>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateCOGE(details.coge.filter((_: any, i: number) => i !== idx))}
                                        className="p-2 text-red-300 hover:text-red-600 transition-colors"
                                    >
                                        <TrashBinIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === "refs" && (
                    <div className="space-y-4">
                        {details?.nRef?.length === 0 ? <p className="text-center py-10 text-gray-400 italic">Aucune référence archivée</p> : details?.nRef?.map((ref: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-l-4 border-blue-600">
                                <p className="text-xs font-black text-blue-600 uppercase mb-1">{ref.document}</p>
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{ref.reference}</p>
                                    <p className="text-[10px] text-gray-400">{ref.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "reports" && (
                    <div className="space-y-4">
                        {details?.rapports?.length === 0 ? <p className="text-center py-10 text-gray-400 italic">Aucun rapport émis</p> : details?.rapports?.map((rep: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors group">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600">
                                    <DocsIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{rep.titre}</p>
                                    <p className="text-[10px] text-gray-400">Année: {rep.annee?.debut}-{rep.annee?.fin} • Émis le {rep.date}</p>
                                </div>
                                <a href={rep.document} target="_blank" className="p-2 text-gray-300 hover:text-gray-900 dark:hover:text-white"><ArrowRightIcon className="w-5 h-5" /></a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
