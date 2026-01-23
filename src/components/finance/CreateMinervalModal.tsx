"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { XMarkIcon } from "@/icons";
import { createMinerval } from "@/lib/actions/finance/minervalActions";

interface CreateMinervalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  etabId: string;
  anneeId: string;
}

export default function CreateMinervalModal({
  isOpen,
  onClose,
  onSuccess,
  etabId,
  anneeId
}: CreateMinervalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tranches, setTranches] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tranche: "",
    description: ""
  });

  useEffect(() => {
    if (isOpen) {
      fetchTranches();
    }
  }, [isOpen]);

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
      const result = await createMinerval({
        etablissement: etabId,
        annee: anneeId,
        tranche: formData.tranche,
        description: formData.description ? [formData.description] : undefined
      });

      if (result.success) {
        onSuccess();
        onClose();
        setFormData({ tranche: "", description: "" });
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nouveau Minerval
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tranche *</Label>
            <select
              value={formData.tranche}
              onChange={(e) => setFormData({ ...formData, tranche: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Sélectionner une tranche</option>
              {tranches.map((tranche) => (
                <option key={tranche._id} value={tranche._id}>
                  {tranche.designation} - ${tranche.montant}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description optionnelle"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}