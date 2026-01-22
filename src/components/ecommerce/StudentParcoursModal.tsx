"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { GroupIcon, UserCircleIcon } from "@/icons";
import { Parcours } from "../etablissement/Dashboard";
import ParcoursCard from "./ParcoursCard";

interface StudentParcoursModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: { code: string; designation: string } | null;
    parcours: Parcours[];
}

const StudentParcoursModal = ({ isOpen, onClose, program, parcours }: StudentParcoursModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResults = parcours.filter(p =>
        p?.etudiant &&
        (p.etudiant?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.etudiant?.postNom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.etudiant?.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.etudiant?.matricule?.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-6xl h-[90vh] flex flex-col"
        >
            <div className="p-8 flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            Étudiants : {program?.code}
                        </h3>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
                            {program?.designation} • {filteredResults.length} Inscrits
                        </p>
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant (Nom, Matricule...)"
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-blue-500/30 rounded-2xl text-sm transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                        {filteredResults.length > 0 ? filteredResults.map((p, idx) => (
                            <ParcoursCard key={idx} parcours={p} />
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <GroupIcon className="w-10 h-10 text-gray-300" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-400">Aucun étudiant trouvé</h4>
                                <p className="text-xs uppercase tracking-widest mt-1 font-bold">Essayez une autre recherche</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default StudentParcoursModal;
