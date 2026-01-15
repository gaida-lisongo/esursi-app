"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import Spinner from "@/components/ui/Spinner";

interface AgentFormProps {
    agent?: any;
    grades: any[];
    provinces: any[];
    onClose: () => void;
    onSubmit: (formData: any) => Promise<any>;
}

export const AgentForm = ({ agent, grades, provinces, onClose, onSubmit }: AgentFormProps) => {
    const { showNotification } = useNotification();
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const res = await onSubmit(data);

        setLoading(false);
        if (res.success) {
            showNotification(res.message || "Opération réussie", "success");
            onClose();
        } else {
            showNotification(res.message || "Une erreur est survenue", "error");
        }
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                {agent ? "Modifier l'agent" : "Ajouter un agent"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                        <input name="nom" defaultValue={agent?.nom} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Post-nom</label>
                        <input name="postNom" defaultValue={agent?.postNom} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Prénom</label>
                        <input name="prenom" defaultValue={agent?.prenom} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Sexe</label>
                        <select name="sexe" defaultValue={agent?.sexe} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Date de Naissance</label>
                        <input name="dateNaissance" type="date" defaultValue={agent?.dateNaissance ? new Date(agent.dateNaissance).toISOString().split('T')[0] : ''} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                        <input name="telephone" defaultValue={agent?.telephone} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <input name="email" type="email" defaultValue={agent?.email} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Adresse</label>
                    <input name="adresse" defaultValue={agent?.adresse} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Grade</label>
                        <select name="grade" defaultValue={agent?.grade?.id || agent?.grade} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Sélectionner un grade</option>
                            {grades.map(g => <option key={g.id} value={g.id}>{g.designation} ({g.code})</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Province</label>
                        <select name="province" defaultValue={agent?.province?.id || agent?.province} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Sélectionner une province</option>
                            {provinces.map(p => <option key={p.id} value={p.id}>{p.designation}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Lien Photo (Optionnel)</label>
                    <input name="photo" defaultValue={agent?.photo} className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="https://..." />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nationalité</label>
                    <input name="nationalite" defaultValue={agent?.nationalite || "Congolaise"} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-500 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        Annuler
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                        {loading && <Spinner size="sm" />}
                        {agent ? "Mettre à jour" : "Créer l'agent"}
                    </button>
                </div>
            </form>
        </div>
    );
};
