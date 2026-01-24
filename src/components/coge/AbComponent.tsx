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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {inscription.programme.designation}
                        </h3>
                        <p className="text-brand-100 text-sm">
                          Programme d'inscription
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ${inscription.tranche.montant.toLocaleString()}
                        </div>
                        <p className="text-brand-100 text-sm">Montant à payer</p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {inscription.tranche.designation}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tranche de paiement</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {inscription.annee.debut} - {inscription.annee.fin}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Année académique</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {inscription.programme.cycle && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {inscription.programme.cycle.designation}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Cycle d'études</p>
                            </div>
                          </div>
                        )}
                        
                        {inscription.programme.code && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {inscription.programme.code}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Code programme</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {inscription.description && inscription.description.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Description:</span> {inscription.description.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {inscription._id.slice(-8)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedInscription(inscription);
                            setShowInscriptionDetails(true);
                          }}
                          className="px-4 py-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors font-medium text-sm"
                          title="Voir détails"
                        >
                          <EyeIcon className="w-4 h-4 inline mr-1" />
                          Détails
                        </button>
                        <button
                          onClick={() => handleDeleteInscription(inscription._id)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium text-sm"
                          title="Supprimer"
                        >
                          <TaskIcon className="w-4 h-4 inline mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {minerval.tranche.designation}
                        </h3>
                        <p className="text-emerald-100 text-sm">
                          Minerval académique
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ${minerval.tranche.montant.toLocaleString()}
                        </div>
                        <p className="text-emerald-100 text-sm">Montant à payer</p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {minerval.etablissement.designation}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Établissement</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {minerval.annee.debut} - {minerval.annee.fin}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Année académique</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {minerval.etablissement.sigle && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {minerval.etablissement.sigle}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Sigle établissement</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Minerval
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Type de paiement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {minerval.description && minerval.description.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Description:</span> {minerval.description.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {minerval._id.slice(-8)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedMinerval(minerval);
                            setShowMinervalDetails(true);
                          }}
                          className="px-4 py-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors font-medium text-sm"
                          title="Voir détails"
                        >
                          <EyeIcon className="w-4 h-4 inline mr-1" />
                          Détails
                        </button>
                        <button
                          onClick={() => handleDeleteMinerval(minerval._id)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium text-sm"
                          title="Supprimer"
                        >
                          <TrashBinIcon className="w-4 h-4 inline mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
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