"use client";

import React from "react";
import { addCalendarSection, removeCalendarSection } from "@/lib/actions/education/anneeActions";
import { useNotification } from "@/context/NotificationContext";

export const CreateSectionForm = ({ anneeId, onClose }: { anneeId: string, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action(fd: FormData) {
        const res = await addCalendarSection(anneeId, fd.get("titre") as string);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Nouvelle Section du Calendrier</h3>
            <p className="text-sm text-gray-500">Exemple: Inscription, Examens 1er Semestre, etc.</p>
            <input name="titre" placeholder="Titre de la section" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold">Créer</button>
            </div>
        </form>
    );
};

export const DeleteSectionForm = ({ anneeId, item, onClose }: { anneeId: string, item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action() {
        const res = await removeCalendarSection(anneeId, item.index);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <div className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Supprimer la Section</h3>
            <p>Voulez-vous supprimer la section <b>{item.titre}</b> et TOUTES ses activités ?</p>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Confirmer</button>
            </div>
        </div>
    );
};
