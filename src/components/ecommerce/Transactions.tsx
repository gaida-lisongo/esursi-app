'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { MoreDotIcon, EyeIcon, CloseIcon, FileIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface TransactionData {
  _id: string;
  annee: string;
  data: any[];
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      {initials}
    </div>
  );
};

const ProgressBar = ({ paid, total }: { paid: number; total: number }) => {
  const percentage = Math.min(Math.round((paid / total) * 100), 100);
  const remaining = total - paid;

  return (
    <div className="w-full max-w-[120px]">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{percentage}%</span>
        <span className="text-[10px] font-bold text-gray-500">{remaining}$ restants</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StudentModal = ({ student, onClose }: { student: any; onClose: () => void }) => {
  if (!student) return null;
  const [parcours, setParcours] = useState<any[]>([]);
  const [dossier, setDossier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`/api/etudiants/${student._id}/parcours`).then(r => r.json()),
          fetch(`/api/etudiants/${student._id}/dossier`).then(r => r.json())
        ]);
        if (pRes.success) setParcours(pRes.data);
        if (dRes.success) setDossier(dRes.data);
      } catch (error) {
        console.error("Error loading student details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [student._id]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 shrink-0">
          <div className="flex items-center gap-4">
            <Avatar name={`${student.nom} ${student.prenom}`} />
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">
                {student.nom} {student.postNom} {student.prenom}
              </h3>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{student.matricule}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 font-bold"
          >
            X
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Section: Stats & Quick Info */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Profil Personnel</h4>
              <div className="grid gap-2 text-sm">
                <p><span className="text-gray-400 font-medium">Sexe:</span> <span className="font-bold dark:text-gray-200">{student.sexe}</span></p>
                <p><span className="text-gray-400 font-medium">Né(e) le:</span> <span className="font-bold dark:text-gray-200">{new Date(student.dateNaissance).toLocaleDateString()}</span></p>
                <p><span className="text-gray-400 font-medium">Lieu:</span> <span className="font-bold dark:text-gray-200">{student.lieuNaissance}</span></p>
                <p><span className="text-gray-400 font-medium">Nationalité:</span> <span className="font-bold dark:text-gray-200">{student.nationalite}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Contact & Grade</h4>
              <div className="grid gap-2 text-sm">
                <p><span className="text-gray-400 font-medium">Téléphone:</span> <span className="font-bold dark:text-gray-200">{student.telephone}</span></p>
                <p><span className="text-gray-400 font-medium">Email:</span> <span className="font-bold dark:text-gray-200 lowercase">{student.email}</span></p>
                <p><span className="text-gray-400 font-medium">Grade actuel:</span> <span className="font-bold text-blue-600 uppercase italic">{student.grade}</span></p>
              </div>
            </div>
          </div>

          {/* Section: Parcours (Full width cards) */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Parcours Académique</h4>
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-4 text-center text-sm text-gray-400 italic">Chargement du parcours...</div>
              ) : parcours.length > 0 ? parcours.map((p) => (
                <div key={p._id} className="w-full bg-gray-50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm font-black text-blue-600">
                      {p.programme?.code || '??'}
                    </div>
                    <div>
                      <h5 className="font-black text-gray-900 dark:text-white text-sm">{p.programme?.designation}</h5>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {p.etablissement?.sigle} • {p.annee?.debut}-{p.annee?.fin}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge color={p.decision === 'Admis' ? 'success' : p.decision === 'En attente' ? 'warning' : 'error'} size="sm">
                      {p.decision}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="py-8 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center text-gray-400 text-sm">
                  Aucun parcours enregistré
                </div>
              )}
            </div>
          </div>

          {/* Section: Dossier Numérique (Grid cards) */}
          <div className="space-y-4 pb-4">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Dossier Numérique</h4>
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-2 text-center py-4 text-sm text-gray-400 italic">Chargement du dossier...</div>
              ) : dossier?.scolarite?.length > 0 ? dossier.scolarite.map((item: any) => (
                <div key={item._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                      <FileIcon className="w-4 h-4" />
                    </div>
                    <Badge color={item.status === 'OK' ? 'success' : 'warning'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <h6 className="font-bold text-gray-900 dark:text-white text-xs mb-1 truncate">{item.document}</h6>
                  <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                    Année: {item.annee} • {item.date}
                  </p>
                </div>
              )) : (
                <div className="col-span-2 py-8 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center text-gray-400 text-sm">
                  Dossier vide ou en attente
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Transactions({ data }: { data: TransactionData[] }) {

  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 100;

  const currentYearData = data[selectedYearIndex] || { annee: "N/A", data: [] };

  // Parse available fees for the selected year
  const feeFilters = useMemo(() => {
    const fees = new Set<string>();
    currentYearData.data.forEach((t: any) => {
      if (t.tranche?.frais?.designation) {
        fees.add(t.tranche.frais.designation);
      }
    });
    return Array.from(fees);
  }, [currentYearData]);

  // Set default fee filter if current is ALL or empty and we have fees
  useMemo(() => {
    if ((selectedFeeFilter === "ALL" || selectedFeeFilter === "") && feeFilters.length > 0) {
      setSelectedFeeFilter(feeFilters[0]);
    }
  }, [feeFilters, selectedFeeFilter]);

  // Filter & Sort logic
  const filteredData = useMemo(() => {
    const filtered = currentYearData.data.filter((t: any) => {
      const etudiant = t.etudiant || {};
      const fullName = `${etudiant.nom} ${etudiant.postNom} ${etudiant.prenom}`.toLowerCase();
      const matricule = (etudiant.matricule || "").toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = fullName.includes(q) || matricule.includes(q);
      const matchesFee = t.tranche?.frais?.designation === selectedFeeFilter;

      return matchesSearch && matchesFee;
    });

    // Sort alphabetically by student name (Nom + PostNom + Prenom)
    return filtered.sort((a: any, b: any) => {
      const nameA = `${a.etudiant?.nom || ""} ${a.etudiant?.postNom || ""} ${a.etudiant?.prenom || ""}`.toLowerCase();
      const nameB = `${b.etudiant?.nom || ""} ${b.etudiant?.postNom || ""} ${b.etudiant?.prenom || ""}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [currentYearData, searchQuery, selectedFeeFilter]);

  // Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice((page - 1) * limit, page * limit);
  }, [filteredData, page]);

  return (
    <div className="rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-white p-6 shadow-2xl shadow-gray-200/20 dark:shadow-none dark:bg-white/[0.03]">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Opérations & Paiements</h3>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Année {currentYearData.annee}</p>
          </div>

          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher nom ou matricule..."
                className="pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 transition-all w-72"
              />
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-blue-200 transition-all font-bold text-sm text-gray-700 dark:text-gray-300"
              >
                <span>{currentYearData.annee}</span>
                <MoreDotIcon className="w-5 h-5 text-gray-400" />
              </button>

              <Dropdown
                isOpen={isYearDropdownOpen}
                onClose={() => setIsYearDropdownOpen(false)}
                className="w-48 p-2 mt-2"
              >
                {data?.map((item, index) => (
                  <DropdownItem
                    tag="button"
                    key={index}
                    onItemClick={() => {
                      setSelectedYearIndex(index);
                      setIsYearDropdownOpen(false);
                      setPage(1);
                    }}
                    className={`flex w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedYearIndex === index ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  >
                    {item.annee}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Fee Filters (Tabs Style) */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 gap-8 overflow-x-auto scrollbar-hide">
          {feeFilters.map((fee) => (
            <button
              key={fee}
              onClick={() => setSelectedFeeFilter(fee)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${selectedFeeFilter === fee ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {fee}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-800/10 border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Etudiant</TableCell>
              <TableCell isHeader className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Progression</TableCell>
              <TableCell isHeader className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Montant Versé</TableCell>
              <TableCell isHeader className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Référence</TableCell>
              <TableCell isHeader className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((t: any) => (
              <TableRow key={t._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                <TableCell className="py-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${t.etudiant?.nom} ${t.etudiant?.prenom}`} />
                    <div>
                      <p className="font-black text-gray-900 text-sm dark:text-white">{t.etudiant?.nom} {t.etudiant?.postNom}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.etudiant?.matricule}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-5">
                  <ProgressBar
                    paid={t.montant}
                    total={t.tranche?.frais?.montant || 0}
                  />
                  <p className="text-[9px] font-bold text-gray-400 mt-1">{t.tranche?.designation}</p>
                </TableCell>

                <TableCell className="py-5 text-center">
                  <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg font-black text-sm">
                    {t.montant.toLocaleString()} $
                  </span>
                </TableCell>

                <TableCell className="py-5">
                  <div className="flex flex-col gap-1">
                    <Badge color={t.status === "OK" ? "success" : t.status === "PENDING" ? "warning" : "error"} size="sm">
                      {t.status}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell className="py-5 text-right">
                  <button
                    onClick={() => setSelectedStudent(t.etudiant)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:text-blue-600 hover:border-blue-100 dark:hover:bg-gray-700 transition-all shadow-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Voir parcours
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/10 rounded-full flex items-center justify-center text-gray-300">
                      <SearchIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Aucune transaction trouvée</h4>
                      <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Simplified) */}
      {filteredData.length > limit && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-3 disabled:opacity-30 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500"
          >
            Précédent
          </button>
          <span className="text-sm font-black text-gray-400">Page {page} / {Math.ceil(filteredData.length / limit)}</span>
          <button
            disabled={page >= Math.ceil(filteredData.length / limit)}
            onClick={() => setPage(page + 1)}
            className="p-3 disabled:opacity-30 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Student Details Modal */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
