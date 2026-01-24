"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import RevenuChart from "./RevenuChart";

interface FormBudgetProps {
    anneeId?: string;
    etabId?: string;
}

interface BudgetDetail {
    ligne: string;
    credit: number;
}

interface CreatedBudget {
    _id: string;
    designation: string;
    montant: number;
    etablissement: any;
    annee: any;
    details: BudgetDetail[];
}

const FormBudget = (data: FormBudgetProps) => {
    const [designation, setDesignation] = useState("");
    const [montant, setMontant] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [createdBudget, setCreatedBudget] = useState<CreatedBudget | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const createBudget = async ({ designation, montant }: { designation: string, montant: number }) => {
        try {
            const req = await fetch('/api/depenses/budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    etablissement: data.etabId,
                    annee: data.anneeId,
                    designation,
                    montant,
                    details: [],
                })
            });

            if (req.ok) {
                const res = await req.json();
                
                const { success, message, data: budgetData } = res;

                if (success) {
                    return {
                        message,
                        data: budgetData
                    }
                }
            }

            return { message: "Erreur lors de la création du budget", data: null };
        } catch (error: any) {
            console.error("Error creating budget:", error.message);
            return { message: error.message, data: null };
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!designation.trim() || !montant.trim()) {
            setError("Veuillez remplir tous les champs requis");
            setIsLoading(false);
            return;
        }

        const montantNum = parseFloat(montant);
        if (isNaN(montantNum) || montantNum <= 0) {
            setError("Le montant doit être un nombre positif");
            setIsLoading(false);
            return;
        }

        try {
            const result = await createBudget({
                designation: designation.trim(),
                montant: montantNum
            });

            if (result.data) {
                setCreatedBudget(result.data);
                setSuccess(result.message);
                // Reset form
                setDesignation("");
                setMontant("");
            } else {
                setError(result.message);
            }
        } catch (err: any) {
            setError("Une erreur inattendue s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewBudget = () => {
        setCreatedBudget(null);
        setSuccess("");
        setError("");
    };

    // Si un budget a été créé, afficher le RevenuChart
    if (createdBudget) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Budget créé avec succès !
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Visualisez la distribution de votre budget ci-dessous
                        </p>
                    </div>
                    <Button
                        onClick={handleNewBudget}
                        variant="outline"
                        className="text-sm"
                    >
                        Créer un nouveau budget
                    </Button>
                </div>

                <RevenuChart data={createdBudget} />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Créer un nouveau budget
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Définissez le budget pour votre établissement
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Désignation du budget *
                    </label>
                    <Input
                        type="text"
                        placeholder="Ex: Budget fonctionnement 2024-2025"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Montant total (USD) *
                    </label>
                    <input
                        type="number"
                        placeholder="Ex: 100000"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="pt-4">
                    <Button
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Création en cours...
                            </div>
                        ) : (
                            "Créer le budget"
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>• Le budget sera initialement créé sans lignes budgétaires</p>
                    <p>• Vous pourrez ajouter des lignes de détail ultérieurement</p>
                    <p>• Le montant total servira de plafond pour la répartition</p>
                </div>
            </div>
        </div>
    );
}

export default FormBudget;