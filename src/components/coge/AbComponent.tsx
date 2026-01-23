"use client";

import { useState, useEffect } from "react";
import { PlusIcon, BellIcon as SearchIcon, EyeIcon, TrashBinIcon, TaskIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import CreateInscriptionModal from "@/components/finance/CreateInscriptionModal";
import CreateMinervalModal from "@/components/finance/CreateMinervalModal";
import InscriptionDetailsModal from "@/components/finance/InscriptionDetailsModal";
import MinervalDetailsModal from "@/components/finance/MinervalDetailsModal";
import { getInscriptionsByEtabAnnee, deleteInscription } from "@/lib/actions/finance/inscriptionActions";
import { getMinervalsByEtabAnnee, deleteMinerval } from "@/lib/actions/finance/minervalActions";

interface AbComponentProps {
  etabId: string;
  anneeId: string;
}

export default function AbComponent({ etabId, anneeId }: AbComponentProps) {
  const [activeTab, setActiveTab] = useState<"inscriptions" | "minervals">("inscriptions");
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [minervals, setMinervals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateInscription, setShowCreateInscription] = useState(false);
  const [showCreateMinerval, setShowCreateMinerval] = useState(false);
  const [showInscriptionDetails, setShowInscriptionDetails] = useState(false);
  const [showMinervalDetails, setShowMinervalDetails] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<any>(null);
  const [selectedMinerval, setSelectedMinerval] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [etabId, anneeId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [inscriptionsRes, minervalsRes] = await Promise.all([
        getInscriptionsByEtabAnnee(etabId, anneeId),
        getMinervalsByEtabAnnee(etabId, anneeId)
      ]);

      if (inscriptionsRes.success) {
        setInscriptions(inscriptionsRes.data);
      }
      if (minervalsRes.success) {
        setMinervals(minervalsRes.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInscription = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
      const result = await deleteInscription(id);
      if (result.success) {
        fetchData();
      }
    }
  };

  const handleDeleteMinerval = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce minerval ?")) {
      const result = await deleteMinerval(id);
      if (result.success) {
        fetchData();
      }
    }
  };

  const filteredInscriptions = inscriptions.filter(inscription =>
    inscription.programme.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inscription.tranche.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMinervals = minervals.filter(minerval =>
    minerval.tranche.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minerval.etablissement.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "inscriptions", label: "Inscriptions", count: inscriptions.length },
    { id: "minervals", label: "Minervals", count: minervals.length }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Rechercher ${activeTab === "inscriptions" ? "des inscriptions" : "des minervals"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => {
              if (activeTab === "inscriptions") {
                setShowCreateInscription(true);
              } else {
                setShowCreateMinerval(true);
              }
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Nouveau {activeTab === "inscriptions" ? "Inscription" : "Minerval"}
          </Button>
        </div>

        <div className="space-y-3">
          {activeTab === "inscriptions" ? (
            filteredInscriptions.length > 0 ? (
              filteredInscriptions.map((inscription) => (
                <div
                  key={inscription._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {inscription.programme.designation}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Programme
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {inscription.tranche.designation}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tranche
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold text-brand-600 dark:text-brand-400 text-lg">
                          ${inscription.tranche.montant.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Montant
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {inscription.annee.debut} - {inscription.annee.fin}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Année académique
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedInscription(inscription);
                          setShowInscriptionDetails(true);
                        }}
                        className="p-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors"
                        title="Voir détails"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInscription(inscription._id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <TaskIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {inscription.description && inscription.description.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {inscription.description.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? "Aucune inscription trouvée" : "Aucune inscription disponible"}
              </div>
            )
          ) : (
            filteredMinervals.length > 0 ? (
              filteredMinervals.map((minerval) => (
                <div
                  key={minerval._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {minerval.tranche.designation}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tranche Minerval
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {minerval.etablissement.designation}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Établissement
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold text-brand-600 dark:text-brand-400 text-lg">
                          ${minerval.tranche.montant.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Montant
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {minerval.annee.debut} - {minerval.annee.fin}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Année académique
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedMinerval(minerval);
                          setShowMinervalDetails(true);
                        }}
                        className="p-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors"
                        title="Voir détails"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMinerval(minerval._id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {minerval.description && minerval.description.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {minerval.description.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? "Aucun minerval trouvé" : "Aucun minerval disponible"}
              </div>
            )
          )}
        </div>
      </div>

      <CreateInscriptionModal
        isOpen={showCreateInscription}
        onClose={() => setShowCreateInscription(false)}
        onSuccess={fetchData}
        etabId={etabId}
        anneeId={anneeId}
      />

      <CreateMinervalModal
        isOpen={showCreateMinerval}
        onClose={() => setShowCreateMinerval(false)}
        onSuccess={fetchData}
        etabId={etabId}
        anneeId={anneeId}
      />

      {selectedInscription && (
        <InscriptionDetailsModal
          isOpen={showInscriptionDetails}
          onClose={() => {
            setShowInscriptionDetails(false);
            setSelectedInscription(null);
          }}
          inscription={selectedInscription}
          etabId={etabId}
        />
      )}

      {selectedMinerval && (
        <MinervalDetailsModal
          isOpen={showMinervalDetails}
          onClose={() => {
            setShowMinervalDetails(false);
            setSelectedMinerval(null);
          }}
          minerval={selectedMinerval}
        />
      )}
    </div>
  );
}