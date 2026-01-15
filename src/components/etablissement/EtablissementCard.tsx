"use client";

import React from "react";
import Image from "next/image";
import {
    PencilIcon,
    TrashBinIcon,
    PageIcon,
    GroupIcon,
    CopyIcon,
    DocsIcon,
    ArrowRightIcon,
    TableIcon
} from "@/icons";
import Link from "next/link";

export const EtablissementCard = ({
    item,
    onUpdate,
    onDelete,
    onManage
}: {
    item: any,
    onUpdate: (item: any) => void,
    onDelete: (item: any) => void,
    onManage: (item: any) => void
}) => {
    return (
        <div className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>

            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <TableIcon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${item.actif ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"}`}>
                        {item.actif ? "Actif" : "Inactif"}
                    </span>
                    <p className="mt-2 text-xs font-bold text-gray-400">{item.sigle}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.designation}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
                    {item.adresse || "Aucune adresse spécifiée"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                    onClick={() => onManage(item)}
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group/btn"
                >
                    <GroupIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Gérer COGE</span>
                </button>
                <Link
                    href={`/etablissements/${item.id}`}
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all group/btn"
                >
                    <DocsIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-indigo-600 mb-1" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Facultés</span>
                </Link>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50 dark:border-gray-800">
                <div className="flex gap-2">
                    <button onClick={() => onUpdate(item)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(item)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><TrashBinIcon className="w-4 h-4" /></button>
                </div>
                <div className="text-[10px] font-bold text-gray-300 uppercase letter-spacing-widest">Établissement</div>
            </div>
        </div>
    );
};
