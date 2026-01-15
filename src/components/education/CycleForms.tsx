"use client";

import React from "react";
import { createCycle, updateCycle, deleteCycle } from "@/lib/actions/education/programmeActions";
import { useNotification } from "@/context/NotificationContext";

export const CreateCycleForm = ({ onClose }: { onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action(fd: FormData) {
        const res = await createCycle(Object.fromEntries(fd));
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Nouveau Cycle</h3>
            <input name="code" placeholder="Code" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="designation" placeholder="Désignation" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="credits" type="number" placeholder="Total Crédits" required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="maquetteUrl" placeholder="URL Maquette (Optionnel)" className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold">Créer</button>
            </div>
        </form>
    );
};

export const UpdateCycleForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action(fd: FormData) {
        const res = await updateCycle(item.id, Object.fromEntries(fd));
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <form action={action} className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Modifier Cycle</h3>
            <input name="code" defaultValue={item.code} required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="designation" defaultValue={item.designation} required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="credits" type="number" defaultValue={item.credits} required className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <input name="maquetteUrl" defaultValue={item.maquetteUrl} className="w-full p-3 border rounded-2xl dark:bg-gray-800" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold">Enregistrer</button>
            </div>
        </form>
    );
};

export const DeleteCycleForm = ({ item, onClose }: { item: any, onClose: () => void }) => {
    const { showNotification } = useNotification();
    async function action() {
        const res = await deleteCycle(item.id);
        if (res.success) onClose();
        else showNotification(res.message, "error");
    }
    return (
        <div className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Supprimer Cycle</h3>
            <p>Êtes-vous sûr de vouloir supprimer <b>{item.designation}</b> ?</p>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500">Annuler</button>
                <button onClick={action} className="px-6 py-2 bg-red-600 text-white rounded-2xl font-bold">Supprimer</button>
            </div>
        </div>
    );
};
