"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { XMarkIcon, DownloadIcon } from "@/icons";
import { getPaiementsByMinerval } from "@/lib/actions/finance/paiementActions";
import PDFGenerator from "./PDFGenerator";

interface MinervalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  minerval: any;
}

export default function MinervalDetailsModal({
  isOpen,
  onClose,
  minerval
}: MinervalDetailsModalProps) {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && minerval) {
      fetchPaiements();
    }
  }, [isOpen, minerval]);

  const fetchPaiements = async () => {
    if (!minerval?.tranche?._id) return;
    
    setIsLoading(true);
    try {
      const result = await getPaiementsByMinerval(minerval.tranche._id);
      if (result.success) {
        setPaiements(result.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const pdfData = {
      type: "minerval",
      id: minerval._id,
      titre: "Fiche de Minerval",
      description: `Minerval - ${minerval.etablissement.designation}`,
      tranche: minerval.tranche,
      etablissement: minerval.etablissement.designation,
      annee: `${minerval.annee.debut} - ${minerval.annee.fin}`,
      qrCodeUrl: `/minerval/${minerval._id}/pay`
    };
    
    PDFGenerator.generatePaymentSlip(pdfData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'NO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OK': return 'Payé';
      case 'PENDING': return 'En attente';
      case 'NO': return 'Non payé';
      default: return 'Inconnu';
    }
  };

  if (!isOpen || !minerval) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Détails du Minerval
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
                  <span className="font-medium">Établissement:</span> {minerval.etablissement.designation}
                </div>
                <div>
                  <span className="font-medium">Année:</span> {minerval.annee.debut} - {minerval.annee.fin}
                </div>
                <div>
                  <span className="font-medium">Tranche:</span> {minerval.tranche.designation}
                </div>
                <div>
                  <span className="font-medium">Montant:</span> ${minerval.tranche.montant.toLocaleString()}
                </div>
                {minerval.description && (
                  <div>
                    <span className="font-medium">Description:</span> {minerval.description.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Paiements ({paiements.length})
              </h4>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto"></div>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {paiements.length > 0 ? (
                    paiements.map((paiement) => (
                      <div key={paiement._id} className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-brand-500">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">
                            {paiement.etudiant.nom} {paiement.etudiant.prenom}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(paiement.status)}`}>
                            {getStatusText(paiement.status)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div>Montant: ${paiement.montant.toLocaleString()}</div>
                          <div>N° Commande: {paiement.orderNumber}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      Aucun paiement trouvé
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