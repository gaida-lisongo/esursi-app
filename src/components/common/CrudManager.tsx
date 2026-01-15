"use client";

import React, { ReactNode, ReactElement, cloneElement, useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Spinner from "../ui/Spinner";
import { useNotification } from "@/context/NotificationContext";

interface CrudManagerProps<T extends { id: string | number } & Record<string, any>> {
  title: string;
  header: (keyof T & string)[];
  items: T[];
  CreateForm?: React.ComponentType<{ onClose: () => void }>;
  UpdateForm?: React.ComponentType<{ item: T; onClose: () => void }>;
  DeleteForm?: React.ComponentType<{ item: T; onClose: () => void }>;
  searchKeys?: (keyof T & string)[];
  isLoading?: boolean;
}

export default function CrudManager<T extends { id: string | number } & Record<string, any>>({
  title,
  header,
  items,
  CreateForm,
  UpdateForm,
  DeleteForm,
  searchKeys = [],
  isLoading = false,
}: CrudManagerProps<T>) {
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"list" | "show" | "update" | "delete">("list");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof T & string; direction: "asc" | "desc" } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered and Sorted items
  const processedItems = useMemo(() => {
    let result = [...items];

    // Search
    if (searchTerm.trim()) {
      const lowered = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => item[key]?.toString().toLowerCase().includes(lowered))
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, searchTerm, searchKeys, sortConfig]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedItems.slice(start, start + pageSize);
  }, [processedItems, currentPage]);

  const totalPages = Math.ceil(processedItems.length / pageSize);

  const requestSort = (key: keyof T & string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleClose = (successMessage?: string) => {
    setMode("list");
    if (successMessage) {
      showNotification(successMessage, "success");
    }
  };

  const renderComponent = () => {
    if (mode === "list") return null;

    let component = null;
    if (mode === "show" && CreateForm) {
      component = <CreateForm onClose={() => handleClose("Élément ajouté avec succès")} />;
    } else if (mode === "update" && selectedItem && UpdateForm) {
      component = <UpdateForm item={selectedItem} onClose={() => handleClose("Élément mis à jour avec succès")} />;
    } else if (mode === "delete" && selectedItem && DeleteForm) {
      component = <DeleteForm item={selectedItem} onClose={() => handleClose("Élément supprimé avec succès")} />;
    }

    if (!component) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1">
            {component}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 id="table-title" className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{processedItems.length} éléments au total</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {CreateForm && (
            <button
              onClick={() => setMode("show")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              aria-label={`Ajouter un nouvel élément à ${title}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all"
              aria-label="Rechercher dans le tableau"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <Table aria-labelledby="table-title">
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50/50 dark:bg-gray-800/50">
            <TableRow>
              {header.map((h) => (
                <TableCell
                  key={h}
                  isHeader={true}
                  className="py-3 font-semibold text-gray-600 text-start text-theme-xs dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => requestSort(h)}
                >
                  <div className="flex items-center gap-1">
                    {h}
                    {sortConfig?.key === h ? (
                      sortConfig.direction === "asc" ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" /></svg>
                      )
                    ) : (
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10l5-5 5 5H5z" /></svg>
                    )}
                  </div>
                </TableCell>
              ))}
              <TableCell
                isHeader={true}
                className="py-3 font-semibold text-gray-600 text-end text-theme-xs dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                {header.map((key) => (
                  <TableCell
                    key={`${item.id}-${key}`}
                    className="py-4 text-gray-700 text-theme-sm dark:text-white/80"
                  >
                    {key.toLowerCase().includes("image") && item[key] ? (
                      <div className="h-10 w-10 overflow-hidden rounded-lg shadow-sm">
                        <Image
                          width={40}
                          height={40}
                          src={item[key]}
                          alt={`${item[header[0]]} image`}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="truncate max-w-[200px] block">
                        {item[key]?.toString() || "-"}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="py-4 text-end">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setMode("update");
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20 transition-all"
                      title="Modifier"
                      aria-label={`Modifier ${item[header[0]]}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setMode("delete");
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-all"
                      title="Supprimer"
                      aria-label={`Supprimer ${item[header[0]]}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginatedItems.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length + 1} className="py-12 text-center text-gray-500 italic">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Aucun élément trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Précédent
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, and pages around current
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm rounded-lg transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={i} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Rendu dynamique des formulaires */}
      {renderComponent()}
    </div>
  );
}
