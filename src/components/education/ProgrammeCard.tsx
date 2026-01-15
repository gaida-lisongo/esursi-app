"use client";

import React from "react";
import { CopyIcon, PencilIcon, TrashBinIcon, DocsIcon } from "@/icons";

interface ProgrammeItem {
    id: string;
    nom: string;
    designation: string;
    code: string;
    credits: number;
    description?: string;
    actif: boolean;
}

export const ProgrammeCard = ({
    item,
    onUpdate,
    onDelete
}: {
    item: ProgrammeItem,
    onUpdate: (item: ProgrammeItem) => void,
    onDelete: (item: ProgrammeItem) => void
}) => {
    return (
        <div className="relative p-6 transition-all duration-300 bg-white border border-gray-100 rounded-3xl hover:shadow-xl dark:bg-gray-900 dark:border-gray-800 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <DocsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${item.actif ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500"}`}>
                    {item.actif ? "Actif" : "Inactif"}
                </span>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{item.designation}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.code}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-500">
                    {item.credits} Crédits
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50 dark:border-gray-800">
                <button
                    onClick={() => onUpdate(item)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors"
                >
                    <PencilIcon className="w-4 h-4" />
                    Editer
                </button>
                <button
                    onClick={() => onDelete(item)}
                    className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                    <TrashBinIcon className="w-4 h-4" />
                    Supprimer
                </button>
            </div>
        </div>
    );
};
