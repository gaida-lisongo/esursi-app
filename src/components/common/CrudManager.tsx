"use client";

import React, { ReactNode, ReactElement, cloneElement, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

type ItemType = Record<string, any>;

interface CrudManagerProps<T extends { id: string | number } & Record<string, any>> {
  title: string;
  header: (keyof T & string)[];
  items: T[];
  CreateForm: React.ComponentType<{ onClose: () => void }>;
  UpdateForm: React.ComponentType<{ item: T; onClose: () => void }>;
  DeleteForm: React.ComponentType<{ item: T; onClose: () => void }>;
  searchKeys?: (keyof T & string)[];          // sur quelles clés faire la recherche (ex: ['name', 'category'])
}

export default function CrudManager<T extends { id: string | number } & Record<string, any>>({
  title,
  header,
  items,
  CreateForm,
  UpdateForm,
  DeleteForm,
  searchKeys = [],
}: CrudManagerProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [mode, setMode] = useState<"list" | "show" | "update" | "delete">("list");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // Filtrage en fonction de la recherche
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    const filtered = items.filter((item) =>
      searchKeys.some(
        (key) =>
          item[key]?.toString().toLowerCase().includes(lowered)
      )
    );
    setFilteredItems(filtered);
  }, [searchTerm, items, searchKeys]);

  // Affichage des composants modaux/formulaires avec injection de props (item + callbacks)
  const renderComponent = () => {
    if (mode === "list") return null;

    let component = null;
    if (mode === "show") {
      component = <CreateForm onClose={() => setMode("list")} />;
    } else if (mode === "update" && selectedItem) {
      component = <UpdateForm item={selectedItem} onClose={() => setMode("list")} />;
    } else if (mode === "delete" && selectedItem) {
      component = <DeleteForm item={selectedItem} onClose={() => setMode("list")} />;
    }

    if (!component) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg">
          {component}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("show")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Ajouter
          </button>
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {header.map((h) => (
                <TableCell
                  key={h}
                  isHeader={true}
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </TableCell>
              ))}
              <TableCell
                isHeader={true}
                className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {header.map((key) => (
                  <TableCell
                    key={key}
                    className="py-3 text-gray-800 text-theme-sm dark:text-white/80"
                  >
                    {/* Exemple rendu conditionnel image ou texte */}
                    {key.toLowerCase().includes("image") && item[key] ? (
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src={item[key]}
                          alt={`${item[header[0]]} image`}
                        />
                      </div>
                    ) : (
                      item[key]?.toString() || "-"
                    )}
                  </TableCell>
                ))}
                <TableCell className="py-3 text-end">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setMode("update");
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20"
                      title="Modifier"
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
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell className="py-8 text-center text-gray-500 italic">
                  Aucun élément trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rendu dynamique des formulaires */}
      {renderComponent()}
    </div>
  );
}
