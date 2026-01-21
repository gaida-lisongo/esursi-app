import React from "react";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { Metrics } from "../ecommerce/Metrics";
import RevenuChart from "../ecommerce/RevenuChart";
import TargetChart from "../ecommerce/TargetChart";

import { DecaissementCarousel } from "../finance/DecaissementCarousel";
import Transactions from "../ecommerce/Transactions";

export interface Transaction {
    _id: string;
    annee: any;
    data: {
        etudiant: any;
        status: 'OK' | 'PENDING' | 'NO';
        orderNumber: string;
        montant: number;
        tranche: any;
    }[];
}

export interface Parcours {
    etudiant: any;
    programme: any;
    annee: string;
    decision: 'Admis' | 'Non Admis' | 'En attente';
    status: 'OK' | 'PENDING' | 'NO';
    etablissement: any;
    tranche: any;
}

export interface Metrique {
    icon: any;
    title: string;
    value: number;
    proportion: number;
    annee: string;
    status: 'up' | 'down';
}

interface FinaceProps {
    isLoading?: boolean;
    metriques: Metrique[];
    budget?: {
        annee: string;
        montant: number;
        designation: string;
        details: {
            ligne: string;
            credit: number;
        }[];
        planHebdo: {
            designation: string;
            montant: number;
            lignes: string[];
            ordres: {
                ligne: string;
                beneficiaire: string;
                montant: number;
                status: 'OK' | 'PENDING' | 'NO'
            }[];
        }[]
    };
    parcours: Parcours[];
    transactions: Transaction[];
}

export default function FinanceDashboard({
    isLoading,
    metriques,
    budget,
    parcours,
    transactions
}: FinaceProps) {
    console.log("transactions:", transactions);
    console.log("budget:", budget);
    console.log("parcours:", parcours);
    console.log("metriques:", metriques);
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in duration-500">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full dark:border-blue-900/20"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Analyse des données...</h3>
                    <p className="text-xs text-gray-500 font-medium italic">Préparation de votre dashboard financier</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6 animate-in fade-in duration-700">
            <div className="col-span-12 space-y-3">
                {metriques.length > 0 && <Metrics data={metriques} />}
            </div>

            <div className="col-span-12 flex flex-col lg:flex-row gap-3">
                <div className="lg:w-2/3 space-y-3">
                    {budget && <RevenuChart data={budget} />}
                    {budget?.planHebdo && budget.planHebdo.length > 0 && <DecaissementCarousel data={budget} />}
                </div>
                <div className="lg:w-1/3">
                    {parcours.length > 0 && <TargetChart data={parcours} />}
                </div>
            </div>

            <div className="col-span-12 ">
                {transactions.length > 0 && <Transactions data={transactions} />}
            </div>
        </div>
    );
}
