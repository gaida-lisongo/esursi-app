"use client";

import React from "react";
import Image from "next/image";
import { UserCircleIcon, PencilIcon, TrashBinIcon, LockIcon, PlusIcon } from "@/icons";

interface AgentItem {
    id: string;
    nom: string;
    postNom: string;
    prenom: string;
    matricule: string;
    photo?: string;
    sexe: string;
    telephone: string;
    email: string;
    grade: { designation: string; code: string };
    province: { designation: string; code: string };
    autorisation: any[];
}

interface AgentCardProps {
    agent: AgentItem;
    onUpdate: (agent: AgentItem) => void;
    onDelete: (agent: AgentItem) => void;
    onManageAuth: (agent: AgentItem) => void;
}

export const AgentCard = ({ agent, onUpdate, onDelete, onManageAuth }: AgentCardProps) => {
    const initials = `${agent.nom[0]}${agent.prenom[0]}`.toUpperCase();

    return (
        <div className="relative flex items-center gap-3 p-3 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-xl hover:shadow-lg dark:bg-gray-900 dark:border-gray-800 group">
            {/* Photo / Initials */}
            <div className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 overflow-hidden border-2 border-gray-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-gray-800">
                {agent.photo ? (
                    <Image
                        src={agent.photo}
                        alt={agent.nom}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {initials}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {agent.nom} {agent.prenom}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold text-green-700 bg-green-100 rounded dark:bg-green-900/30 dark:text-green-500 flex-shrink-0">
                        Actif
                    </span>
                </div>
                <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mb-1">
                    {agent.matricule}
                </p>
                <div className="flex items-center gap-2 text-[9px] text-gray-500 dark:text-gray-400">
                    <span className="truncate">{agent.grade?.code || "N/A"}</span>
                    <span>•</span>
                    <span className="truncate">{agent.province?.designation || "N/A"}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onManageAuth(agent)}
                    className="p-1.5 text-gray-500 transition-colors hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    title="Autorisations"
                >
                    <LockIcon className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onUpdate(agent)}
                    className="p-1.5 text-gray-500 transition-colors hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    title="Modifier"
                >
                    <PencilIcon className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onDelete(agent)}
                    className="p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Désactiver"
                >
                    <TrashBinIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};
