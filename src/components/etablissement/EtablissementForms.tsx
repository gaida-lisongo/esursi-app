"use client";

import React from "react";
import { createEtablissement, updateEtablissement } from "@/lib/actions/etablissement/actions";
import { useNotification } from "@/context/NotificationContext";

export const EtablissementForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { showNotification } = useNotification();

    async function action(fd: FormData) {
        const data = Object.fromEntries(fd);
        const res = item
            ? await updateEtablissement(item.id, data)
            : await createEtablissement(data);

        if (res.success) onClose();
        else showNotification(res.message, "error");
    }

    return (
        <form action={action} className="p-8 space-y-4 bg-white dark:bg-gray-900 rounded-[2.5rem]">
            <h3 className="text-xl font-bold">{item ? "Modifier" : "Nouvel"} Établissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Sigle</label>
                    <input name="sigle" defaultValue={item?.sigle} placeholder="ex: UNIKIN" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Désignation</label>
                    <input name="designation" defaultValue={item?.designation} placeholder="Nom complet" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                    <input name="email" type="email" defaultValue={item?.email} placeholder="contact@univ.ac" className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Téléphone</label>
                    <input name="telephone" defaultValue={item?.telephone} placeholder="+243..." className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Site Web</label>
                <input name="website" defaultValue={item?.website} placeholder="https://..." className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Adresse</label>
                <textarea name="adresse" defaultValue={item?.adresse} className="w-full p-3 border rounded-2xl dark:bg-gray-800 h-20 resize-none" />
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
