"use client";

import React from "react";
import { createFrais, updateFrais, deleteFrais } from "@/lib/actions/finance/fraisActions";
import { useNotification } from "@/context/NotificationContext";

export const FraisForm = ({ item, anneeId, onClose }: { item?: any, anneeId: string, onClose: () => void }) => {
    const { showNotification } = useNotification();

    async function action(fd: FormData) {
        const data = Object.fromEntries(fd);
        const res = item
            ? await updateFrais(item.id, data)
            : await createFrais({ ...data, annee: anneeId });

        if (res.success) onClose();
        else showNotification(res.message, "error");
    }

    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">{item ? "Modifier" : "Nouveau"} Frais Académique</h3>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Désignation</label>
                <input name="designation" defaultValue={item?.designation} placeholder="ex: Frais d'Inscription" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Catégorie</label>
                    <select name="categorie" defaultValue={item?.categorie || "Global"} className="w-full p-3 border rounded-2xl dark:bg-gray-800">
                        <option value="Global">Global</option>
                        <option value="Recrutement">Recrutement</option>
                        <option value="Montante">Montante</option>
                        <option value="Doctorat">Doctorat</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Montant ($)</label>
                    <input name="montant" type="number" defaultValue={item?.montant} placeholder="0.00" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Annuler</button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                    {item ? "Enregistrer" : "Créer"}
                </button>
            </div>
        </form>
    );
};

export const DeleteFraisForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();

    async function action() {
        const res = await deleteFrais(item.id);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }

    return (
        <div className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Supprimer Frais</h3>
            <p>Voulez-vous supprimer les frais <b>{item.designation}</b> ?</p>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Confirmer</button>
            </div>
        </div>
    );
};
