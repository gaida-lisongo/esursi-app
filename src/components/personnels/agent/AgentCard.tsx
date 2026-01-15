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
        <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-3xl hover:shadow-xl dark:bg-gray-900 dark:border-gray-800 group">
            {/* Header / Background Pattern */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>

            <div className="px-6 pb-6 -mt-12">
                <div className="flex items-end justify-between mb-4">
                    {/* Photo / Initials */}
                    <div className="relative flex items-center justify-center w-24 h-24 overflow-hidden border-4 border-white rounded-2xl bg-gray-50 dark:bg-gray-800 dark:border-gray-900 shadow-md">
                        {agent.photo ? (
                            <Image
                                src={agent.photo}
                                alt={agent.nom}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {initials}
                            </span>
                        )}
                    </div>

                    {/* Status Badge */}
                    <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-500">
                        Active Agent
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {agent.nom} {agent.postNom} {agent.prenom}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {agent.matricule}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Grade</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{agent.grade?.code || "N/A"}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Province</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{agent.province?.designation || "N/A"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                    <div className="flex -space-x-2 overflow-hidden">
                        {agent.autorisation?.length > 0 ? (
                            agent.autorisation.map((auth, i) => (
                                <div key={i} className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-blue-500 text-white text-[10px] font-bold uppercase" title={auth.role}>
                                    {auth.role[0]}
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400 italic">Aucune autorisation</span>
                        )}
                    </div>
                    <button
                        onClick={() => onManageAuth(agent)}
                        className="ml-auto p-2 text-gray-500 transition-colors hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                        title="Gérer les autorisations"
                    >
                        <LockIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => onUpdate(agent)}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(agent)}
                        className="flex items-center gap-2 text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                    >
                        <TrashBinIcon className="w-4 h-4" />
                        Désactiver
                    </button>
                </div>
            </div>
        </div>
    );
};
