"use client";

import React from "react";
import { PlusIcon, TrashBinIcon } from "@/icons";

interface AuthManagerProps {
    authorizations: any[];
    onSave: (auths: any[]) => void;
    onClose: () => void;
}

export const AuthManager = ({ authorizations, onSave, onClose }: AuthManagerProps) => {
    const [auths, setAuths] = React.useState([...authorizations]);

    const ROLES = ["SGACAD", "SGR", "SGADMIN", "DG", "AB", "PERSONNEL", "ETABLISSEMENT", "FINANCE", "ALL"];

    const addAuth = () => {
        setAuths([...auths, { role: ROLES[0], secureKey: "", status: "PENDING" }]);
    };

    const removeAuth = (index: number) => {
        setAuths(auths.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: string) => {
        const newAuths = [...auths];
        newAuths[index] = { ...newAuths[index], [field]: value };
        setAuths(newAuths);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gérer les autorisations</h3>
                <button
                    onClick={addAuth}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            <div className="space-y-3">
                {auths.length === 0 ? (
                    <p className="py-8 text-center text-gray-400 italic">Aucune autorisation configurée</p>
                ) : (
                    auths.map((auth, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 items-end">
                            <div className="col-span-12 md:col-span-4 space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Rôle</label>
                                <select
                                    value={auth.role}
                                    onChange={(e) => handleChange(index, "role", e.target.value)}
                                    className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                                >
                                    {ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-12 md:col-span-4 space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Secure Key</label>
                                <input
                                    value={auth.secureKey}
                                    onChange={(e) => handleChange(index, "secureKey", e.target.value)}
                                    placeholder="Clef..."
                                    className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3 space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Statut</label>
                                <select
                                    value={auth.status}
                                    onChange={(e) => handleChange(index, "status", e.target.value)}
                                    className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="OK">OK</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>
                            <div className="col-span-12 md:col-span-1 flex justify-center pb-1">
                                <button
                                    onClick={() => removeAuth(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <TrashBinIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="px-6 py-2 font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                    Annuler
                </button>
                <button
                    onClick={() => onSave(auths)}
                    className="px-8 py-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                    Enregistrer les modifications
                </button>
            </div>
        </div>
    );
};
