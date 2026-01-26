"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon, PlusIcon, DollarLineIcon, TrashBinIcon, CheckLineIcon, CloseLineIcon, ListIcon } from "@/icons";
import Badge from "../ui/badge/Badge";
import { Ordre } from "./DecaissementCarousel";

const OrdersModal = ({ orders, title, onClose, planId, allLignes, role, onUpdate }: { orders: Ordre[]; title: string; onClose: () => void, planId: string, allLignes: any[], role?: string, onUpdate?: () => void }) => {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        beneficiaire: "",
        montant: "",
        description: "",
        ligne: allLignes?.[0]?._id || ""
    });

    if (!orders) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const req = await fetch('/api/depenses/ordres', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    beneficiaire: formData.beneficiaire,
                    montant: Number(formData.montant),
                    description: [formData.description],
                    ligne: formData.ligne
                })
            });
            const res = await req.json();
            if (res.success) {
                setIsAdding(false);
                setFormData({ beneficiaire: "", montant: "", description: "", ligne: allLignes?.[0]?._id || "" });
                if (onUpdate) {
                    onUpdate();
                } else {
                    router.refresh();
                }
            }
        } catch (error) {
            console.error("Error creating ordre : ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cet ordre ?")) return;
        try {
            const req = await fetch(`/api/depenses/ordres/${id}`, { method: 'DELETE' });
            const res = await req.json();
            if (res.success) {
                if (onUpdate) {
                    onUpdate();
                } else {
                    router.refresh();
                }
            }
        } catch (error) {
            console.error("Error deleting ordre : ", error);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const req = await fetch(`/api/depenses/ordres/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const res = await req.json();
            if (res.success) {
                if (onUpdate) {
                    onUpdate();
                } else {
                    router.refresh();
                }
            }
        } catch (error) {
            console.error("Error updating status : ", error);
        }
    };

    const exportToCSV = () => {
        if (!orders.length) return;

        const headers = ["Bénéficiaire", "Ligne", "Description", "Montant ($)", "Statut"];
        const rows = orders.map(o => [
            o.beneficiaire,
            o.ligne?.designation || "",
            o.description?.join(" | ") || "",
            o.montant,
            o.status
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Ordres_Paiement_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Ordres de Paiement</h3>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {role === "DG" && !isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                                <PlusIcon className="w-3 h-3" />
                                Nouveau
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 font-bold"
                        >
                            X
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {isAdding && (
                        <form onSubmit={handleCreate} className="bg-gray-50 dark:bg-white/[0.03] border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bénéficiaire</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nom du bénéficiaire"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        value={formData.beneficiaire}
                                        onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Montant ($)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="Montant"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        value={formData.montant}
                                        onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ligne Budgétaire</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                    value={formData.ligne}
                                    onChange={(e) => setFormData({ ...formData, ligne: e.target.value })}
                                >
                                    {allLignes.map((l: any) => (
                                        <option key={l._id} value={l._id}>{l.designation}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    placeholder="Détails de l'ordre de paiement..."
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white min-h-[80px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? "Création..." : "Enregistrer l'ordre"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase active:scale-95 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

                    {orders.length > 0 ? orders.map((ordre) => (
                        <div key={ordre._id} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm font-black text-blue-600">
                                    <DollarLineIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-black text-gray-900 dark:text-white text-sm uppercase">{ordre.beneficiaire}</h5>
                                        <span className="text-[9px] px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-bold uppercase truncate max-w-[120px]">
                                            {ordre.ligne?.designation}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 line-clamp-1 italic">
                                        {ordre.description?.[0] || "Aucune description"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{ordre.montant.toLocaleString()} $</p>
                                        <Badge color={ordre.status === 'OK' ? 'success' : ordre.status === 'PENDING' ? 'warning' : 'error'} size="sm">
                                            {ordre.status}
                                        </Badge>
                                    </div>
                                    {role === "AB" && (
                                        <div className="flex gap-1">
                                            {ordre.status !== 'OK' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(ordre._id, 'OK')}
                                                    className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    title="Valider"
                                                >
                                                    <CheckLineIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            {ordre.status !== 'NO' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(ordre._id, 'NO')}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title="Rejeter"
                                                >
                                                    <CloseLineIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(ordre._id)}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                                title="Supprimer"
                                            >
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-12 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                            <ListIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm font-medium">Aucun ordre de paiement enregistré</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50/50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs shrink-0">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Total Ordres: {orders.reduce((acc, curr) => acc + curr.montant, 0).toLocaleString()} $</span>
                    <button
                        onClick={exportToCSV}
                        className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-gray-200/20 active:scale-95"
                    >
                        Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersModal;