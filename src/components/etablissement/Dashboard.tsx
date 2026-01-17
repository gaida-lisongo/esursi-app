import type { Metadata } from "next";
import React from "react";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { Metrics } from "../ecommerce/Metrics";
import RevenuChart from "../ecommerce/RevenuChart";
import TargetChart from "../ecommerce/TargetChart";

import { DecaissementCarousel } from "../finance/DecaissementCarousel";
import Transactions from "../ecommerce/Transactions";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

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

interface FinaceProps {
    metriques: {
        icon: string;
        title: string;
        value: number;
        proportion: number;
        annee: string;
        status: 'up' | 'down';
    }[];
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
    metriques,
    budget,
    parcours,
    transactions
}: FinaceProps) {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-3">
                <Metrics data={[1, 2, 3]} />

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
