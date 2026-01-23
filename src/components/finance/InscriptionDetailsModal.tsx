"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { AlertIcon as XMarkIcon, DownloadIcon } from "@/icons";
import { getParcoursByAnneeEtab } from "@/lib/actions/finance/fraisActions";
import PDFGenerator from "./PDFGenerator";

interface InscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscription: any;
  etabId: string;
}

export default function InscriptionDetailsModal({
  isOpen,
  onClose,
  inscription,
  etabId
}: InscriptionDetailsModalProps) {
  const [parcours, setParcours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && inscription) {
      fetchParcours();
    }
  }, [isOpen, inscription]);

  const fetchParcours = async () => {
    if (!inscription?.tranche?._id) return;
    
    setIsLoading(true);
    try {
      const result = await getParcoursByAnneeEtab(inscription.annee._id, etabId);
      if (result.success) {
        const filteredParcours = result.data.filter((p: any) => 
          p.tranche._id === inscription.tranche._id
        );
        setParcours(filteredParcours);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des parcours:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const pdfData = {
      type: "inscription",
      id: inscription._id,
      titre: "Fiche d'Inscription",
      description: `Inscription - ${inscription.programme.designation}`,
      tranche: inscription.tranche,
      etablissement: inscription.etablissement.designation,
      annee: `${inscription.annee.debut} - ${inscription.annee.fin}`,
      qrCodeUrl: `/inscription/${inscription._id}/pay`
    };
    
    PDFGenerator.generatePaymentSlip(pdfData);
  };

  if (!isOpen || !inscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Détails de l'Inscription
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={generatePDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Imprimer Fiche
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Informations Générales
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Programme:</span> {inscription.programme.designation}
                </div>
                <div>
                  <span className="font-medium">Année:</span> {inscription.annee.debut} - {inscription.annee.fin}
                </div>
                <div>
                  <span className="font-medium">Tranche:</span> {inscription.tranche.designation}
                </div>
                <div>
                  <span className="font-medium">Montant:</span> {inscription.tranche.montant.toLocaleString()} FC
                </div>
                {inscription.description && (
                  <div>
                    <span className="font-medium">Description:</span> {inscription.description.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Parcours Étudiants ({parcours.length})
              </h4>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto"></div>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {parcours.length > 0 ? (
                    parcours.map((p) => (
                      <div key={p._id} className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-brand-500">
                        <div className="text-sm font-medium">
                          {p.etudiant.nom} {p.etudiant.prenom}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Decision: <span className={`font-medium ${
                            p.decision === 'Admis' ? 'text-green-600' : 
                            p.decision === 'Non Admis' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {p.decision}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      Aucun parcours trouvé
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}