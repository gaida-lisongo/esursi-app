"use client";

import React, { useEffect, useState } from "react";
import CrudManager from "@/components/common/CrudManager";
import { getQuotasByFrais, addQuota, updateQuota, removeQuota } from "@/lib/actions/finance/fraisActions";
import { useNotification } from "@/context/NotificationContext";
import { CloseIcon } from "@/icons";

export const ManageQuotasModal = ({ frais, onClose }: { frais: any, onClose: () => void }) => {
    const [quotas, setQuotas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const loadData = async () => {
        setLoading(true);
        const res = await getQuotasByFrais(frais.id);
        if (res.success) setQuotas(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const QuotaAddUpdateForm = ({ item, onClose: onFormClose }: { item?: any, onClose: () => void }) => {
        async function action(fd: FormData) {
            const data = Object.fromEntries(fd);
            const res = item
                ? await updateQuota(item.id, data)
                : await addQuota(frais.id, data);

            if (res.success) {
                onFormClose();
                loadData();
            } else {
                showNotification(res.message, "error");
            }
        }

        return (
            <form action={action} className="p-6 space-y-4 bg-white dark:bg-gray-900 rounded-3xl">
                <h4 className="text-lg font-bold">{item ? "Modifier" : "Nouveau"} Quota</h4>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Désignation</label>
                    <input name="designation" defaultValue={item?.designation} placeholder="ex: Droit d'auteur" required className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Montant ($)</label>
                    <input name="montant" type="number" step="0.01" defaultValue={item?.montant} placeholder="0.00" required className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onFormClose} className="px-4 py-2 text-gray-400 font-bold">Annuler</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Enregistrer</button>
                </div>
            </form>
        );
    };

    const QuotaDeleteForm = ({ item, onClose: onFormClose }: { item: any, onClose: () => void }) => {
        async function action() {
            const res = await removeQuota(frais.id, item.id);
            if (res.success) {
                onFormClose();
                loadData();
            } else {
                showNotification(res.message, "error");
            }
        }
        return (
            <div className="p-6 space-y-4">
                <p>Retirer <b>{item.designation}</b> ?</p>
                <div className="flex justify-end gap-2 text-sm">
                    <button onClick={onFormClose}>Annuler</button>
                    <button onClick={action} className="text-red-500 font-bold">Retirer</button>
                </div>
            </div>
        );
    };

    const totalAllocated = quotas.reduce((sum, q) => sum + (q.montant || 0), 0);
    const remaining = frais.montant - totalAllocated;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] w-full max-w-4xl mt-8   animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-indigo-50/30 dark:bg-indigo-900/10">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Clé de Répartition</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase">{frais.designation} ({frais.montant} $)</p>
                </div>
                <button onClick={onClose} className="p-2 bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-gray-800 rounded-xl transition-colors text-white hover:text-white">X</button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div className="px-4 py-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="flex gap-4">
                        <span>Alloué: <b className="text-blue-600">{totalAllocated} $</b></span>
                        <span>Reste: <b className={remaining < 0 ? "text-red-600" : "text-green-600"}>{remaining} $</b></span>
                    </div>
                </div>

                <CrudManager
                    title="Quotas de répartition"
                    header={["designation", "montant"]}
                    items={quotas}
                    isLoading={loading}
                    CreateForm={QuotaAddUpdateForm}
                    UpdateForm={QuotaAddUpdateForm}
                    DeleteForm={QuotaDeleteForm}
                    searchKeys={["designation"]}
                />
            </div>
        </div>
    );
};
