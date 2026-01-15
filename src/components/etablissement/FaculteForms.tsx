"use client";

import React from "react";
import { deleteFaculte } from "@/lib/actions/etablissement/actions";
import { useNotification } from "@/context/NotificationContext";

export const DeleteFaculteForm = ({ item, etablissementId, onClose }: { item: any, etablissementId: string, onClose: () => void }) => {
    const { showNotification } = useNotification();

    async function action() {
        const res = await deleteFaculte(item.id, etablissementId);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }

    return (
        <div className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Supprimer Faculté</h3>
            <p>Voulez-vous supprimer la faculté <b>{item.designation}</b> ?</p>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Confirmer la suppression</button>
            </div>
        </div>
    );
};
