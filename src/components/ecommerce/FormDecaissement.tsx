"use client"

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";

interface FormDecaissementProps {
    lignes: {
        designation: string;
        _id: string;
    }[];
    budgetId?: string;
    titre?: string;
    onClose?: () => void;
    onSuccess?: () => void;
}

const FormDecaissement = ({ budgetId, lignes, titre, onClose, onSuccess }: FormDecaissementProps) => {
    const [formData, setFormData] = useState({
        designation: "",
        montant: "",
        pieces: [] as string[],
        lignes: [] as string[],
        ordres: [] as any[],
        budget: budgetId || ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const createPlanHebdo = async () => {
        if (!formData.designation.trim() || !formData.montant.trim()) {
            setError("Veuillez remplir tous les champs requis");
            return;
        }

        const montantNum = parseFloat(formData.montant);
        if (isNaN(montantNum) || montantNum <= 0) {
            setError("Le montant doit être un nombre positif");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const req = await fetch('/api/depenses/plan-hebdo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    montant: montantNum
                })
            });

            if (req.ok) {
                const res = await req.json();
                const { success, message, data } = res;

                if (success) {
                    // Appeler les callbacks de mise à jour
                    if (onSuccess) onSuccess();
                    if (onClose) onClose();
                }
            } else {
                setError("Erreur lors de la création du plan");
            }
        } catch (error) {
            console.error("Error creating plan hebdo:", error);
            setError("Une erreur inattendue s'est produite");
        } finally {
            setIsLoading(false);
        }
    }

    const handleLigneToggle = (ligneId: string) => {
        setFormData(prev => ({
            ...prev,
            lignes: prev.lignes.includes(ligneId)
                ? prev.lignes.filter(id => id !== ligneId)
                : [...prev.lignes, ligneId]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Nouveau Plan Hebdomadaire
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Créer un plan de décaissement pour {titre}
                    </p>
                </div>
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="text-sm"
                >
                    Annuler
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Désignation du plan *
                        </label>
                        <Input
                            type="text"
                            placeholder="Ex: Plan semaine 1 - Janvier 2025"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Montant prévu (USD) *
                        </label>
                        <input
                            type="number"
                            placeholder="Ex: 5000"
                            value={formData.montant}
                            onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                            disabled={isLoading}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lignes budgétaires concernées
                    </label>
                    <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                        {lignes.map(ligne => (
                            <label key={ligne._id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.lignes.includes(ligne._id)}
                                    onChange={() => handleLigneToggle(ligne._id)}
                                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {ligne.designation}
                                </span>
                            </label>
                        ))}
                    </div>
                    {lignes.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Aucune ligne budgétaire disponible
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={isLoading}
                >
                    Annuler
                </Button>
                <Button
                    onClick={createPlanHebdo}
                    disabled={isLoading || !formData.designation.trim() || !formData.montant.trim()}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Création...
                        </div>
                    ) : (
                        "Créer le plan"
                    )}
                </Button>
            </div>
        </div>
    );
}
export default FormDecaissement;