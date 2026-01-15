"use client";

import React, { useRef } from "react";
import {
    DollarLineIcon,
    ArrowRightIcon,
    DownloadIcon,
    ListIcon,
    ChevronLeftIcon,
    ChevronDownIcon
} from "@/icons";

const FAKE_DECAISSEMENTS = [
    {
        id: "1",
        periode: "Janvier 2026",
        dateCreation: "15 Janv 2026",
        montant: 12500,
        pourcentage: 85,
        type: "Fonctionnement"
    },
    {
        id: "2",
        periode: "Février 2026",
        dateCreation: "10 Janv 2026",
        montant: 8400,
        pourcentage: 45,
        type: "Investissement"
    },
    {
        id: "3",
        periode: "Mars 2026",
        dateCreation: "05 Janv 2026",
        montant: 22000,
        pourcentage: 92,
        type: "Salaires"
    },
    {
        id: "4",
        periode: "Avril 2026",
        dateCreation: "01 Janv 2026",
        montant: 15750,
        pourcentage: 60,
        type: "Social"
    }
];

const DecaissementCard = ({ item }: { item: any }) => {
    return (
        <div className="min-w-[310px] bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-5 transition-all duration-300 group hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-1">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                        <DollarLineIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 leading-tight">{item.periode}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.dateCreation}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">{item.montant.toLocaleString()} $</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                style={{ width: `${item.pourcentage}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] font-black text-blue-600">{item.pourcentage}%</span>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-50 dark:bg-gray-800/50 mb-2"></div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95">
                    <ListIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase">Ordres</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95">
                    <DownloadIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase">Justifs</span>
                </button>
            </div>
        </div>
    );
};

export const DecaissementCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="rounded-[2.5rem] space-y-3 shadow-2xl shadow-gray-200/10 dark:shadow-none">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Décaissellements Récents</h3>
                    <p className="text-xs text-gray-500 font-medium italic">Suivi des flux financiers de l'établissement</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {FAKE_DECAISSEMENTS.map((item) => (
                    <div key={item.id} className="snap-start">
                        <DecaissementCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};
