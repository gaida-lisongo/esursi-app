"use client";

import React, { useState } from "react";
import { PlusIcon, TrashBinIcon, PencilIcon, ListIcon, TaskIcon } from "@/icons";
import { addActivityToSection, removeActivityFromSection } from "@/lib/actions/education/anneeActions";
import { useNotification } from "@/context/NotificationContext";
import Spinner from "@/components/ui/Spinner";

interface Activity {
    _id: string;
    designation: string;
    description?: string[];
}

interface Section {
    titre: string;
    activites: Activity[];
}

export const CalendarSectionCard = ({
    item,
    index,
    anneeId,
    onRefresh,
    onUpdate,
    onDelete
}: {
    item: Section,
    index: number,
    anneeId: string,
    onRefresh: () => void,
    onUpdate: (item: any) => void,
    onDelete: (item: any) => void
}) => {
    const { showNotification } = useNotification();
    const [showAddAct, setShowAddAct] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const res = await addActivityToSection(anneeId, index, {
            designation: fd.get("designation"),
            description: fd.get("description")?.toString().split("\n").filter(l => l.trim())
        });
        setLoading(false);
        if (res.success) {
            setShowAddAct(false);
            onRefresh();
        } else {
            showNotification(res.message, "error");
        }
    };

    const handleRemoveActivity = async (activityId: string) => {
        if (!confirm("Supprimer cette activité ?")) return;
        const res = await removeActivityFromSection(anneeId, index, activityId);
        if (res.success) onRefresh();
        else showNotification(res.message, "error");
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <ListIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.titre}</h3>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => onUpdate({ ...item, index })} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete({ ...item, index })} className="p-2 text-gray-400 hover:text-red-500 rounded-lg"><TrashBinIcon className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="space-y-3">
                {item.activites.map((act) => (
                    <div key={act._id} className="group flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{act.designation}</p>
                            {act.description && act.description.length > 0 && (
                                <ul className="mt-1 space-y-1">
                                    {act.description.map((d, i) => (
                                        <li key={i} className="text-[11px] text-gray-500">• {d}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={() => handleRemoveActivity(act._id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                        >
                            <TrashBinIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {showAddAct ? (
                    <form onSubmit={handleAddActivity} className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                        <input name="designation" placeholder="Nom de l'activité" required className="w-full text-sm p-2 bg-transparent border-b outline-none focus:border-blue-500" />
                        <textarea name="description" placeholder="Détails (un par ligne...)" className="w-full text-xs p-2 bg-transparent border-b outline-none h-16 resize-none" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowAddAct(false)} className="text-xs text-gray-400 font-bold uppercase">Annuler</button>
                            <button type="submit" disabled={loading} className="text-xs text-blue-600 font-bold uppercase flex items-center gap-1">
                                {loading ? "..." : "Ajouter"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setShowAddAct(true)}
                        className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Ajouter une activité
                    </button>
                )}
            </div>
        </div>
    );
};
