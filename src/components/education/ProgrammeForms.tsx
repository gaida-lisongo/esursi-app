"use client";

import React from "react";
import { createProgramme, updateProgramme, deleteProgramme } from "@/lib/actions/education/programmeActions";
import { useNotification } from "@/context/NotificationContext";

interface FormProps {
    cycleId: string;
    item?: any;
    onClose: () => void;
}

export const ProgrammeForm = ({ cycleId, item, onClose }: FormProps) => {
    const { showNotification } = useNotification();
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const data = { ...Object.fromEntries(fd), cycle: cycleId };

        const res = item
            ? await updateProgramme(item.id, data)
            : await createProgramme(data);

        setLoading(false);
        if (res.success) {
            showNotification(res.message, "success");
            onClose();
        } else {
            showNotification(res.message, "error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-white dark:bg-gray-900 rounded-[2.5rem]">
            <h3 className="text-xl font-bold">{item ? "Modifier" : "Nouveau"} Programme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="code" defaultValue={item?.code} placeholder="Code" required className="p-3 border rounded-2xl dark:bg-gray-800" />
                <input name="credits" type="number" defaultValue={item?.credits} placeholder="Crédits" required className="p-3 border rounded-2xl dark:bg-gray-800" />
            </div>
            <input name="designation" defaultValue={item?.designation} placeholder="Désignation" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <textarea name="description" defaultValue={item?.description} placeholder="Description" className="w-full p-3 border rounded-2xl dark:bg-gray-800 h-24" />

            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                    {loading ? "Chargement..." : item ? "Enregistrer" : "Créer"}
                </button>
            </div>
        </form>
    );
};

export const DeleteProgrammeForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action() {
        const res = await deleteProgramme(item.id);
        if (res.success) {
            showNotification(res.message, "success");
            onClose();
        } else {
            showNotification(res.message, "error");
        }
    }
    return (
        <div className="p-8 space-y-4 bg-white dark:bg-gray-900 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-red-600">Supprimer Programme</h3>
            <p>Supprimer <b>{item.designation}</b> ?</p>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Confirmer</button>
            </div>
        </div>
    );
};
