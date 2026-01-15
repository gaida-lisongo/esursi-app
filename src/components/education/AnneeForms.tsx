"use client";

import React from "react";
import { createAnnee, updateAnnee, deleteAnnee } from "@/lib/actions/education/anneeActions";
import { useNotification } from "@/context/NotificationContext";

export const CreateAnneeForm = ({ onClose }: { onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action(fd: FormData) {
        const data = Object.fromEntries(fd);
        const res = await createAnnee(data);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Nouvelle Année Académique</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Début</label>
                    <input name="debut" placeholder="ex: 2024" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Fin</label>
                    <input name="fin" placeholder="ex: 2025" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <input name="description" placeholder="ex: Année académique 2024-2025" className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">Créer</button>
            </div>
        </form>
    );
};

export const UpdateAnneeForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action(fd: FormData) {
        const res = await updateAnnee(item.id, Object.fromEntries(fd));
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Modifier l'Année</h3>
            <div className="grid grid-cols-2 gap-4">
                <input name="debut" defaultValue={item.debut} required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
                <input name="fin" defaultValue={item.fin} required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <input name="description" defaultValue={item.description} className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">Enregistrer</button>
            </div>
        </form>
    );
};

export const DeleteAnneeForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action() {
        const res = await deleteAnnee(item.id);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <div className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Supprimer l'Année</h3>
            <p>Voulez-vous supprimer l'année <b>{item.debut}-{item.fin}</b> ?</p>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Confirmer</button>
            </div>
        </div>
    );
};
