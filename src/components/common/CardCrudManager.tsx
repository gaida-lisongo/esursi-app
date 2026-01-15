"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Spinner from "../ui/Spinner";
import { useNotification } from "@/context/NotificationContext";
import {
    PencilIcon,
    TrashBinIcon,
    PlusIcon,
    AngleUpIcon,
    AngleDownIcon,
    HorizontaLDots
} from "../../icons";

interface CardCrudManagerProps<T extends { id: string | number } & Record<string, any>> {
    title: string;
    header: (keyof T & string)[];
    items: T[];
    CreateForm?: React.ComponentType<{ onClose: () => void }>;
    UpdateForm?: React.ComponentType<{ item: T; onClose: () => void }>;
    DeleteForm?: React.ComponentType<{ item: T; onClose: () => void }>;
    searchKeys?: (keyof T & string)[];
    isLoading?: boolean;
    customActions?: (item: T) => React.ReactNode;
}

const SearchSVG = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default function CardCrudManager<T extends { id: string | number } & Record<string, any>>({
    title,
    header,
    items,
    CreateForm,
    UpdateForm,
    DeleteForm,
    searchKeys = [],
    isLoading = false,
    customActions,
}: CardCrudManagerProps<T>) {
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState("");
    const [mode, setMode] = useState<"list" | "create" | "update" | "delete">("list");
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T & string; direction: "asc" | "desc" } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // Logic: Search & Sort
    const processedItems = useMemo(() => {
        let result = [...items];
        if (searchTerm.trim()) {
            const lowered = searchTerm.toLowerCase();
            result = result.filter((item) =>
                searchKeys.some((key) => item[key]?.toString().toLowerCase().includes(lowered))
            );
        }
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [items, searchTerm, searchKeys, sortConfig]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return processedItems.slice(start, start + pageSize);
    }, [processedItems, currentPage]);

    const totalPages = Math.ceil(processedItems.length / pageSize);

    const handleSort = (key: keyof T & string) => {
        setSortConfig(prev => ({
            key,
            direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const handleClose = () => {
        setMode("list");
        setSelectedItem(null);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-sm text-gray-500">{processedItems.length} éléments trouvés</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <SearchSVG />
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-800 dark:text-white w-full md:w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
            ) : processedItems.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-400">Aucune donnée disponible</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Header sorting row (Desktop only) */}
                    <div className="hidden md:flex items-center px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            {header.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => handleSort(h)}
                                    className="flex items-center gap-1 hover:text-blue-600 transition-colors uppercase"
                                >
                                    {h}
                                    {sortConfig?.key === h && (
                                        sortConfig.direction === "asc" ? <AngleUpIcon className="w-3 h-3" /> : <AngleDownIcon className="w-3 h-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="w-24 text-right pr-4">Actions</div>
                    </div>

                    {/* Cards List */}
                    {paginatedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative flex flex-col md:flex-row md:items-center bg-white dark:bg-gray-900 border border-gray-50 dark:border-gray-800 rounded-3xl p-4 md:px-6 md:py-4 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                {header.map((h, i) => (
                                    <div key={h} className="flex flex-col md:block">
                                        <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{h}</span>
                                        <div className={`text-sm font-semibold ${i === 0 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300"}`}>
                                            {typeof item[h] === "boolean" ? (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${item[h] ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500"}`}>
                                                    {item[h] ? "Actif" : "Inactif"}
                                                </span>
                                            ) : (
                                                item[h]?.toString() || "-"
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                {customActions && customActions(item)}
                                {UpdateForm && (
                                    <button
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setMode("update");
                                        }}
                                        className="p-2.5 bg-white dark:bg-gray-800 text-blue-600 rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        title="Modifier"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                )}
                                {DeleteForm && (
                                    <button
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setMode("delete");
                                        }}
                                        className="p-2.5 bg-white dark:bg-gray-800 text-red-500 rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        title="Supprimer"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400"
                    >
                        Précédent
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all ${currentPage === i + 1
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Modals */}
            {mode !== "list" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {mode === "create" && CreateForm && <CreateForm onClose={() => handleClose()} />}
                        {mode === "update" && selectedItem && UpdateForm && <UpdateForm item={selectedItem} onClose={() => handleClose()} />}
                        {mode === "delete" && selectedItem && DeleteForm && <DeleteForm item={selectedItem} onClose={() => handleClose()} />}
                    </div>
                </div>
            )}
        </div>
    );
}
