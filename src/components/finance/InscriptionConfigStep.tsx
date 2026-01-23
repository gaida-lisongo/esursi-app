"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { XMarkIcon, ChevronLeftIcon } from "@/icons";
import { createInscription } from "@/lib/actions/finance/inscriptionActions";

interface InscriptionConfigStepProps {
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
  selectedProgramme: any;
  etabId: string;
  anneeId: string;
}

export default function InscriptionConfigStep({
  onBack,
  onClose,
  onSuccess,
  selectedProgramme,
  etabId,
  anneeId
}: InscriptionConfigStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tranches, setTranches] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tranche: "",
    description: ""
  });

  useEffect(() => {
    fetchTranches();
  }, []);

  const fetchTranches = async () => {
    try {
      const response = await fetch("/api/recettes");
      const result = await response.json();
      if (result.success) {
        setTranches(result.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tranches:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tranche) return;

    setIsLoading(true);
    try {
      const result = await createInscription({
        etablissement: etabId,
        annee: anneeId,
        tranche: formData.tranche,
        programme: selectedProgramme._id,
        description: formData.description ? [formData.description] : undefined
      });

      if (result.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Étape 2: Configuration de l'Inscription
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Programme sélectionné: {selectedProgramme.designation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Récapitulatif du programme sélectionné */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Programme sélectionné
          </h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Programme:</span> {selectedProgramme.designation}
            </div>
            <div>
              <span className="font-medium">Faculté:</span> {selectedProgramme.faculte?.designation}
            </div>
            {selectedProgramme.faculte?.mention?.domaine?.designation && (
              <div>
                <span className="font-medium">Domaine:</span> {selectedProgramme.faculte.mention.domaine.designation}
              </div>
            )}
            {selectedProgramme.cycle?.designation && (
              <div>
                <span className="font-medium">Cycle:</span> {selectedProgramme.cycle.designation}
              </div>
            )}
            {selectedProgramme.credits && (
              <div>
                <span className="font-medium">Crédits:</span> {selectedProgramme.credits}
              </div>
            )}
            {selectedProgramme.description && (
              <div>
                <span className="font-medium">Description:</span> {selectedProgramme.description}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tranche de paiement *</Label>
            <select
              value={formData.tranche}
              onChange={(e) => setFormData({ ...formData, tranche: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Sélectionner une tranche</option>
              {tranches.map((tranche) => (
                <option key={tranche._id} value={tranche._id}>
                  {tranche.designation} - {tranche.montant?.toLocaleString()} FC
                  {tranche.frais?.designation && ` (${tranche.frais.designation})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Description (optionnelle)</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Notes ou informations supplémentaires"
            />
          </div>

          <div className="flex justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Retour
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.tranche}
              >
                {isLoading ? "Création..." : "Créer l'inscription"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}