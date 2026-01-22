"use client";

import React, { useState } from "react";
import {
    PlusIcon,
    TrashBinIcon,
    DownloadIcon,
    FileIcon,
    CalenderIcon,
    CloseIcon,
    CheckCircleIcon
} from "@/icons";
import { addReport, deleteReport, uploadDocumentToServer } from "@/lib/actions/etablissement/actions";
import { useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";

interface RapportsProps {
    rapports: {
        _id?: string;
        titre: string;
        document: string;
        date: string;
        annee: any;
    }[];
    anneeId: string;
    etabId: string;
}

const Rapports = ({ rapports = [], anneeId, etabId }: RapportsProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        titre: "",
        date: new Date().toISOString().split('T')[0],
        document: ""
    });

    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append("file", file);

            const res = await uploadDocumentToServer(data);
            if (res.success && res.link) {
                setFormData(prev => ({ ...prev, document: res.link! }));
            } else {
                alert(res.message || "Erreur lors de l'upload");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion au serveur");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.document) {
            alert("Veuillez attendre la fin de l'upload du document");
            return;
        }

        setIsLoading(true);
        try {
            const res = await addReport(etabId, {
                ...formData,
                annee: anneeId
            });

            if (res.success) {
                setFormData({ titre: "", date: new Date().toISOString().split('T')[0], document: "" });
                setIsAdding(false);
                router.refresh();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (reportId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce rapport ?")) return;

        try {
            const res = await deleteReport(etabId, reportId);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const currentRapports = rapports.filter(r => {
        const rAnneeId = typeof r.annee === 'object' ? r.annee._id?.toString() : r.annee?.toString();
        return rAnneeId === anneeId;
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/10 overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Rapports d'Activité</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Documents & Archives</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${isAdding
                            ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rotate-90"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                        }`}
                >
                    {isAdding ? <CloseIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {isAdding ? (
                    <form onSubmit={handleSave} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du Rapport</label>
                            <input
                                required
                                type="text"
                                placeholder="ex: Rapport Ministériel T1"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500/50 rounded-2xl text-sm outline-none transition-all dark:text-white"
                                value={formData.titre}
                                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date du Rapport</label>
                            <div className="relative">
                                <input
                                    required
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500/50 rounded-2xl text-sm outline-none transition-all dark:text-white appearance-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                                <CalenderIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fichier (PDF, Docx)</label>
                            <div className="relative">
                                <input
                                    required={!formData.document}
                                    type="file"
                                    accept=".pdf,.docx,.doc"
                                    className="hidden"
                                    id="report-file"
                                    onChange={handleFileUpload}
                                    disabled={isUploading || !!formData.document}
                                />
                                <label
                                    htmlFor="report-file"
                                    className={`w-full px-4 py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group ${formData.document
                                            ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50"
                                            : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        }`}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center">
                                            <Spinner className="w-8 h-8 text-blue-500 mb-2" />
                                            <span className="text-[10px] font-black text-blue-600 uppercase">Chargement sur Mega...</span>
                                        </div>
                                    ) : formData.document ? (
                                        <div className="flex flex-col items-center">
                                            <CheckCircleIcon className="w-8 h-8 text-green-500 mb-2" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Document prêt</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FileIcon className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Cliquez pour charger sur Mega</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isUploading || !formData.document}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner className="w-4 h-4" /> : "Valider et Enregistrer"}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        {currentRapports.length > 0 ? (
                            currentRapports.map((report) => (
                                <div key={report._id} className="group bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50 rounded-3xl p-4 flex items-center justify-between transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                                            <FileIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase leading-tight">{report.titre}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{new Date(report.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={report.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            title="Télécharger"
                                        >
                                            <DownloadIcon className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(report._id!)}
                                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Supprimer"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                                    <FileIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium italic">Aucun rapport pour cette année</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer summary */}
            {!isAdding && currentRapports.length > 0 && (
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-800 text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Documents : {currentRapports.length}</span>
                </div>
            )}
        </div>
    );
};

export default Rapports;
