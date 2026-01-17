"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Parcours } from "../etablissement/Dashboard";
import Button from "../ui/button/Button";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Program {
  _id: string;
  designation: string;
  code: string;
  credits: number;
}

export default function TargetChart({
  data
}: {
  data: Parcours[];
}) {

  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(data[0]?.programme as Program);
  const [selectedParcours, setSelectedParcours] = useState<{
    series: number,
    etudiants: any[],
    totalOK: number,
    totalPENDING: number,
    totalNO: number,
    ca: number
  }>({
    series: 0.0,
    etudiants: [],
    totalOK: 0,
    totalPENDING: 0,
    totalNO: 0,
    ca: 0.0
  });

  useEffect(() => {
    const listPrograms: Program[] = [];

    for (const parcours of data) {
      const p = parcours.programme as Program;
      if (!p) continue;
      const isProgramExist = listPrograms.find((program) => program._id === p._id);
      if (!isProgramExist) {
        listPrograms.push({
          _id: p._id,
          designation: p.designation,
          code: p.code,
          credits: p.credits,
        });
      }
    }
    setPrograms(listPrograms);
    if (!selectedProgram && listPrograms.length > 0) {
      setSelectedProgram(listPrograms[0]);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedProgram) return;
    const filterData = data.filter((parcours) => parcours.programme._id === selectedProgram?._id);
    if (!filterData.length) return;

    const pOK = filterData.filter((parcours) => parcours.status === "OK");
    const etudiants = pOK.map((parcours) => parcours.etudiant);
    const totalOK = filterData.filter((p) => p.status === "OK").length;
    const totalPENDING = filterData.filter((p) => p.status === "PENDING").length;
    const totalNO = filterData.filter((p) => p.status === "NO").length;
    const ca = filterData.reduce((total, p) => total + (p?.status === "OK" ? p?.tranche?.montant : 0), 0);
    const series = Math.round((totalOK / filterData.length) * 100);

    setSelectedParcours({
      series: isNaN(series) ? 0 : series,
      etudiants,
      totalOK,
      totalPENDING,
      totalNO,
      ca
    });
  }, [selectedProgram, data]);

  const exportToCSV = () => {
    if (selectedParcours.etudiants.length === 0) return;

    const headers = ["Matricule", "Nom", "Post-Nom", "Prenom", "Sexe", "Email", "Telephone", "Grade", "Adresse"];
    const rows = selectedParcours.etudiants.map(e => [
      e.matricule,
      e.nom,
      e.postNom,
      e.prenom,
      e.sexe,
      e.email,
      e.telephone,
      e.grade,
      e.adresse
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Etudiants_${selectedProgram?.code || 'Export'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const series = [selectedParcours.series ?? 0.0];
  const options: ApexOptions = {
    colors: ["#3b82f6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "75%",
        },
        track: {
          background: "#f1f5f9",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "42px",
            fontWeight: "900",
            offsetY: -30,
            color: "#1e293b",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#60a5fa"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Succès"],
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-white p-6 shadow-2xl shadow-gray-200/20 transition-all duration-500 hover:shadow-blue-500/5 dark:shadow-none dark:bg-white/[0.03]">
      <div className="relative">
        <div className="flex justify-between items-start mb-2">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {selectedProgram?.code || "Analyse"}
            </h3>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1 opacity-80">
              {selectedProgram?.designation || "Vue d'ensemble"}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 transition-all duration-300"
            >
              <MoreDotIcon className="w-5 h-5" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="w-56 p-2 mt-2"
            >
              {programs.map((program) => (
                <DropdownItem
                  tag="button"
                  key={program._id}
                  onItemClick={() => {
                    setSelectedProgram(program);
                    setIsOpen(false);
                  }}
                  className={`flex w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedProgram?._id === program._id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  {program.designation}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="w-full h-[280px] -mt-4 animate-in zoom-in duration-1000">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={350}
            />
          </div>

          <div className="absolute top-[60%] flex flex-col items-center pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <div className="px-5 py-2 bg-blue-600/90 backdrop-blur-md text-white rounded-2xl text-[11px] font-black shadow-2xl shadow-blue-500/40 uppercase tracking-widest flex items-center gap-2.5 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="drop-shadow-sm">CA: {selectedParcours.ca.toLocaleString()}$</span>
            </div>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          className="w-full mt-6 py-4.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.97] flex items-center justify-center gap-3 group/btn"
        >
          Voir les étudiants
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 px-2">
        <div className="flex flex-col items-center group/stat cursor-help">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover/stat:text-red-500 transition-colors duration-300">Rejeté</span>
          <span className="text-xl font-black text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform duration-300 tracking-tight">{selectedParcours.totalNO}</span>
          <div className="w-6 h-1 bg-red-100 dark:bg-red-900/30 rounded-full mt-2 group-hover/stat:w-8 group-hover/stat:bg-red-500 transition-all duration-300"></div>
        </div>

        <div className="flex flex-col items-center group/stat cursor-help">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover/stat:text-amber-500 transition-colors duration-300">En cours</span>
          <span className="text-xl font-black text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform duration-300 tracking-tight">{selectedParcours.totalPENDING}</span>
          <div className="w-6 h-1 bg-amber-100 dark:bg-amber-900/30 rounded-full mt-2 group-hover/stat:w-8 group-hover/stat:bg-amber-500 transition-all duration-300"></div>
        </div>

        <div className="flex flex-col items-center group/stat cursor-help">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover/stat:text-green-500 transition-colors duration-300">Inscrits</span>
          <span className="text-xl font-black text-gray-900 dark:text-white group-hover/stat:scale-110 transition-transform duration-300 tracking-tight">{selectedParcours.totalOK}</span>
          <div className="w-6 h-1 bg-green-100 dark:bg-green-900/30 rounded-full mt-2 group-hover/stat:w-8 group-hover/stat:bg-green-500 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );
}
