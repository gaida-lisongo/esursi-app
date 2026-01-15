import React, { useState, useMemo } from "react";
import { PlusIcon } from "@/icons";
import Spinner from "../ui/Spinner";

// In case SearchIcon is missing in index.tsx, I'll define a local one or use a SVG string
const SearchSVG = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

interface UserCrudProps<T> {
    title: string;
    items: T[];
    renderCard: (item: T) => React.ReactNode;
    onAdd: () => void;
    searchKeys: (keyof T & string)[];
    isLoading?: boolean;
}

export default function UserCrud<T extends { id: string | number } & Record<string, any>>({
    title,
    items,
    renderCard,
    onAdd,
    searchKeys,
    isLoading = false,
}: UserCrudProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;
        const lowered = searchTerm.toLowerCase();
        return items.filter((item) =>
            searchKeys.some((key) => item[key]?.toString().toLowerCase().includes(lowered))
        );
    }, [items, searchTerm, searchKeys]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / pageSize);

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredItems.length} au total
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <SearchSVG />
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-800 dark:text-white w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-lg font-medium text-gray-400">Aucun résultat trouvé</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedItems.map((item) => (
                        <div key={item.id}>
                            {renderCard(item)}
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
                        className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    >
                        Précédent
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
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
                        className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}
