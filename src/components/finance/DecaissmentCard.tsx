"use client";

import { useState } from "react";
import { DollarLineIcon, DownloadIcon, ListIcon, TrashBinIcon } from "@/icons";
import OrdersModal from "./OrdersModal";

const DecaissementCard = ({ item, onDeleted }: { item: any, onDeleted?: () => void }) => {
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le plan "${item.periode}" ?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/depenses/plan-hebdo/${item.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Notifier le parent pour rafraîchir les données
                    if (onDeleted) {
                        onDeleted();
                    }
                }
            } else {
                alert("Erreur lors de la suppression du plan");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression du plan");
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <>
            <div className="min-w-[310px] bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-5 transition-all duration-300 group hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                            <DollarLineIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 leading-tight uppercase">{item.periode}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.dateCreation}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">{item.montant.toLocaleString()} $</p>
                        <div className="flex items-center justify-end gap-2 mt-1.5">
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all duration-1000"
                                    style={{ width: `${item.pourcentage}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-black text-blue-600">{item.pourcentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-50 dark:bg-gray-800/50 mb-4"></div>

                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setIsOrdersOpen(true)}
                        className="flex items-center justify-center gap-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 group/btn"
                    >
                        <ListIcon className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Ordres ({item.ordres.length})</span>
                    </button>
                    <button
                        onClick={() => console.log("Justificatifs :", item?.pieces)}
                        className="flex items-center justify-center gap-1 py-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        <DownloadIcon className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Justifs</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <TrashBinIcon className="w-3 h-3" />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-wider">
                            {isDeleting ? "..." : "Suppr"}
                        </span>
                    </button>
                </div>
            </div>

            {isOrdersOpen && (
                <OrdersModal
                    orders={item.ordres}
                    title={item.periode}
                    planId={item.id}
                    allLignes={item.lignes}
                    role={item.role}
                    onClose={() => setIsOrdersOpen(false)}
                    onUpdate={onDeleted}
                />
            )}
        </>
    );
};

export default DecaissementCard;