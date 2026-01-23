"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { XMarkIcon, ChevronLeftIcon } from "@/icons";
import { getProgrammesByEtablissement } from "@/lib/actions/finance/programmeActions";

interface ProgrammeSelectionStepProps {
  onNext: (selectedProgramme: any) => void;
  onClose: () => void;
  etabId: string;
}

export default function ProgrammeSelectionStep({
  onNext,
  onClose,
  etabId
}: ProgrammeSelectionStepProps) {
  const [facultes, setFacultes] = useState<any[]>([]);
  const [selectedFaculte, setSelectedFaculte] = useState<string>("");
  const [selectedProgramme, setSelectedProgramme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFacultes();
  }, [etabId]);

  const fetchFacultes = async () => {
    try {
      const response = await getProgrammesByEtablissement(etabId);
      if (response.success) {
        setFacultes(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des facultés:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgrammeSelect = (programme: any, faculte: any) => {
    setSelectedProgramme({ ...programme, faculte });
  };

  const handleNext = () => {
    if (selectedProgramme) {
      onNext(selectedProgramme);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des programmes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Étape 1: Sélectionner un Programme
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des facultés */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Facultés disponibles
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {facultes.map((faculte) => (
                <div
                  key={faculte._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFaculte === faculte._id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedFaculte(faculte._id)}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {faculte.designation}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {faculte.mention?.domaine?.designation && (
                      <div>Domaine: {faculte.mention.domaine.designation}</div>
                    )}
                    <div>{faculte.programmes?.length || 0} programme(s)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liste des programmes */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Programmes
            </h4>
            {selectedFaculte ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {facultes
                  .find(f => f._id === selectedFaculte)
                  ?.programmes?.map((programme: any) => (
                    <div
                      key={programme._id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProgramme?._id === programme._id
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                      onClick={() => handleProgrammeSelect(
                        programme, 
                        facultes.find(f => f._id === selectedFaculte)
                      )}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {programme.designation}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <div>Cycle: {programme.cycle?.designation || 'Non spécifié'}</div>
                        <div>Crédits: {programme.credits || 'Non spécifié'}</div>
                        {programme.code && <div>Code: {programme.code}</div>}
                      </div>
                      {programme.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {programme.description}
                        </div>
                      )}
                      {programme.equipe && programme.equipe.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {programme.equipe.length} membre(s) d'équipe
                        </div>
                      )}
                    </div>
                  )) || []}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Sélectionnez une faculté pour voir les programmes
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedProgramme}
          >
            Suivant: Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}