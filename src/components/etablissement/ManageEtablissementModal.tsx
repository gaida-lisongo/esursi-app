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
    ArrowRightIcon,
    PencilIcon
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
    const [memberForm, setMemberForm] = useState<{ mode: "add" | "edit" | null, data: any, index?: number }>({ mode: null, data: null });

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

    const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newMember = {
            fonction: fd.get("fonction"),
            agent: memberForm.data.id || memberForm.data._id
        };

        let newCoge = [...(details.coge || [])];
        if (memberForm.mode === "add") {
            newCoge.push(newMember);
        } else if (memberForm.mode === "edit" && memberForm.index !== undefined) {
            newCoge[memberForm.index] = newMember;
        }

        const res = await updateCOGE(item.id, newCoge);
        if (res.success) {
            showNotification("Comité mis à jour", "success");
            setMemberForm({ mode: null, data: null });
            loadData();
        } else {
            showNotification(res.message, "error");
        }
    };

    const handleRemoveMember = async (idx: number) => {
        if (!confirm("Retirer ce membre ?")) return;
        const newCoge = details.coge.filter((_: any, i: number) => i !== idx);
        const res = await updateCOGE(item.id, newCoge);
        if (res.success) {
            showNotification("Membre retiré", "success");
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
            {!memberForm.mode && (
                <div className="flex px-6 border-b border-gray-50 dark:border-gray-800">
                    <button onClick={() => setTab("coge")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "coge" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>COGE</button>
                    <button onClick={() => setTab("refs")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "refs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>Références</button>
                    <button onClick={() => setTab("reports")} className={`py-4 px-6 text-sm font-bold border-b-2 transition-all ${tab === "reports" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"}`}>Rapports</button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {tab === "coge" && (
                    memberForm.mode ? (
                        <form onSubmit={handleSaveMember} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-3xl">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 font-bold">
                                    {memberForm.data.nom[0]}{memberForm.data.prenom[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black">{memberForm.data.nom} {memberForm.data.prenom}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">{memberForm.data.matricule}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-2">Fonction du membre</label>
                                <select
                                    name="fonction"
                                    defaultValue={memberForm.data?.fonction || "Membre"}
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Recteur">Recteur</option>
                                    <option value="Directeur Général">Directeur Général</option>
                                    <option value="Secrétaire Général Académique">Secrétaire Général Académique</option>
                                    <option value="Secrétaire Général Administratif">Secrétaire Général Administratif</option>
                                    <option value="Administrateur de Budget">Administrateur de Budget</option>
                                    <option value="Membre">Membre</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-800">
                                <button type="button" onClick={() => setMemberForm({ mode: null, data: null })} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Annuler</button>
                                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                                    {memberForm.mode === "add" ? "Ajouter au COGE" : "Enregistrer les modifications"}
                                </button>
                            </div>
                        </form>
                    ) : (
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
                                                    setMemberForm({ mode: "add", data: a });
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
                                    <div key={idx} className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-transparent hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm overflow-hidden border border-gray-100 dark:border-gray-600">
                                            {member.agent?.photo ? <img src={member.agent.photo} className="w-full h-full object-cover" /> : <div className="text-xl font-black text-gray-200">{member.agent?.nom?.[0]}</div>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">{member.fonction}</p>
                                            <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{member.agent?.nom} {member.agent?.prenom}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{member.agent?.matricule}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setMemberForm({ mode: "edit", data: { ...member.agent, fonction: member.fonction }, index: idx })}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveMember(idx)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {details?.coge?.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-bold text-gray-400">Aucun membre dans le comité de gestion</p>
                                        <p className="text-[10px] text-gray-300 uppercase mt-1">Utilisez la recherche pour ajouter des membres</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
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
