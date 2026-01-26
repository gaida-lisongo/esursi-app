"use client";

import React, { useRef, useState } from "react";
import {
    ChevronLeftIcon,
    PlusIcon,
} from "@/icons";
import DecaissementCard from "./DecaissmentCard";
import FormDecaissement from "../ecommerce/FormDecaissement";

export interface Ordre {
    _id: string;
    beneficiaire: string;
    description: string[];
    montant: number;
    status: "OK" | "PENDING" | "NO";
    ligne?: any;
}

export const DecaissementCarousel = ({ data, onRefresh }: { data: any, onRefresh?: () => void }) => {
    const [showForm, setShowForm] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        // Appel du refresh pour mettre à jour les données
        if (onRefresh) {
            onRefresh();
        }
    };

    const handlePlanDeleted = () => {
        // Appel du refresh après suppression
        if (onRefresh) {
            onRefresh();
        }
    };

    const plansHebdo = data?.planHebdo || [];
    let totalOK = 0;

    plansHebdo.forEach((plan: any) => {
        totalOK += plan.ordres?.reduce((acc: number, ordre: any) => acc + (ordre.status === 'OK' ? ordre.montant : 0), 0) || 0;
    });

    const decaissements = plansHebdo.map((plan: any) => {
        const dateStr = plan?.createdAt;
        const amountOK = plan.ordres?.reduce((acc: number, ordre: any) => acc + (ordre.status === 'OK' ? ordre.montant : 0), 0) || 0;
        const pourcentage = plan.montant ? Math.round((amountOK / plan.montant) * 100) : 0;
        return {
            id: plan._id,
            periode: plan.designation,
            dateCreation: dateStr ? new Date(dateStr).toLocaleDateString() : "Date inconnue",
            montant: plan.montant,
            pourcentage: pourcentage,
            lignes: plan.lignes || [],
            type: "Fonctionnement",
            ordres: plan.ordres || [],
            pieces: plan.pieces || [],
            role: data?.userRole
        }
    });

    return (
        <div className="rounded-[2.5rem] space-y-3 shadow-2xl shadow-gray-200/10 dark:shadow-none">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{(data?.designation || "Budget") + " " + (data?.annee?.debut || "") + " - " + (data?.annee?.fin || "")}</h3>
                    <p className="text-xs text-gray-500 font-medium italic">
                        Total Budget : {(data?.montant || 0).toLocaleString()}$ | Décaissé : {totalOK.toLocaleString()}$ | Reste : {Math.max(0, (data?.montant || 0) - totalOK).toLocaleString()}$
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => scroll("left")}
                        className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="p-3 bg-blue-500 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <PlusIcon className="text-white hover:text-blue-600 transition-all" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                    </button>
                </div>
            </div>

            {
                showForm ?
                (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <FormDecaissement 
                        lignes={data?.details.map((detail: any) => ({ designation: detail.ligne?.designation, _id: detail?.ligne?._id }))} 
                        onClose={() => setShowForm(false)}
                        onSuccess={handleFormSuccess}
                        budgetId={data?._id}
                        titre={data?.designation}
                    />
                </div>
                )
                : (
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {decaissements.map((item: any) => (
                        <div key={item.id} className="snap-start">
                            <DecaissementCard 
                                item={item} 
                                onDeleted={handlePlanDeleted}
                            />
                        </div>
                    ))}
                </div>

                )
            }

        </div>
    );
};


