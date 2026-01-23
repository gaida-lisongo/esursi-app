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
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProgrammes();
  }, [etabId]);

  const fetchProgrammes = async () => {
    try {
      const response = await getProgrammesByEtablissement(etabId);
      if (response.success) {
        setProgrammes(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des programmes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProgrammes = programmes.filter(programme =>
    programme.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programme.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programme.mention?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programme.mention?.domaine?.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProgrammeSelect = (programme: any) => {
    setSelectedProgramme(programme);
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

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un programme, mention ou domaine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {filteredProgrammes.length > 0 ? (
              filteredProgrammes.map((programme) => (
                <div
                  key={programme._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProgramme?._id === programme._id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => handleProgrammeSelect(programme)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {programme.designation}
                      </div>
                      {programme.code && (
                        <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                          Code: {programme.code}
                        </div>
                      )}
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Cycle:</span> {programme.cycle?.designation || 'Non spécifié'}
                        </div>
                        <div>
                          <span className="font-medium">Crédits:</span> {programme.credits || 'Non spécifié'}
                        </div>
                        {programme.mention && (
                          <>
                            <div>
                              <span className="font-medium">Mention:</span> {programme.mention.designation}
                            </div>
                            <div>
                              <span className="font-medium">Domaine:</span> {programme.mention.domaine?.designation || 'Non spécifié'}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {programme.description && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {programme.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      {selectedProgramme?._id === programme._id && (
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? "Aucun programme trouvé" : "Aucun programme disponible"}
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