"use client";

import React from "react";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import { Parcours } from "../etablissement/Dashboard";
import { UserIcon } from "@/icons";

interface ParcoursCardProps {
    parcours: Parcours;
}

const ParcoursCard = ({ parcours }: ParcoursCardProps) => {
    const student = parcours.etudiant;
    const photo = student?.photo || "/images/logo_news.png";

    return (
        <div className="group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-500"></div>

            <div className="flex flex-col sm:flex-row gap-6">
                {/* Photo Section */}
                <div className="relative shrink-0 flex flex-col items-center sm:items-start">
                    <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-gray-50 dark:border-gray-800 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        {student?.photo ? (
                            <Image
                                src={photo}
                                alt={`${student?.nom} ${student?.prenom}`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                <Image
                                    src="/images/logo_news.png"
                                    alt="Default Logo"
                                    width={64}
                                    height={64}
                                    className="opacity-20 contrast-50 grayscale"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col items-center sm:items-start">
                        <Badge color={parcours.status === 'OK' ? 'success' : parcours.status === 'PENDING' ? 'warning' : 'error'}>
                            {parcours.status}
                        </Badge>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col mb-4">
                            <h4 className="font-black text-gray-900 dark:text-white uppercase text-base truncate leading-tight tracking-tight">
                                {student?.nom} {student?.postNom} {student?.prenom}
                            </h4>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1 italic">
                                Mat: {student?.matricule || "NON DÉFINI"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Né le</span>
                                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                                    {student?.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString('fr-FR') : '-'}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">A</span>
                                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate">
                                    {student?.lieuNaissance || '-'}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nationalité</span>
                                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate">
                                    {student?.nationalite || '-'}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sexe</span>
                                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                                    {student?.sexe || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em]">Décision</span>
                            <span className={`text-[10px] font-black uppercase ${parcours.decision === 'Admis' ? 'text-green-500' : 'text-amber-500'}`}>
                                {parcours.decision}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em]">Frais payés</span>
                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                {parcours.tranche?.montant?.toLocaleString() || 0} $
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcoursCard;
