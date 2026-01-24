"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon, PlusIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface BudgetDetailFormData {
  ligneDesignation: string;
  credit: number;
}

export default function RevenuChart({
  data
}: { data: any }) {
  console.log("RevenuChart data:", data);
  
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [formDetail, setFormDetail] = useState({
    ligne: "",
    credit: 0
  });
  const [availableLignes, setAvailableLignes] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleForm = () => {
    setShowDetailForm(!showDetailForm);
    if (!showDetailForm) {
      // Load lignes when opening form
      fetchLignes();
    }
  };

  const options: ApexOptions = {
    colors: ["#3b82f6", "#60a5fa"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
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
      },
      events: {
        dataPointSelection: function(event: any, chartContext: any, config: any) {
          const dataPointIndex = config.dataPointIndex;
          if (dataPointIndex >= 0 && data?.details?.[dataPointIndex]) {
            handleRemoveDetail(dataPointIndex);
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data?.details?.map((detail: any) => detail.ligne?.designation || "Ligne") || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "11px",
          fontWeight: 600,
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
          fontWeight: 500,
        },
        formatter: (val: number) => `${val.toLocaleString()} $`,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#60a5fa"],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100]
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const detail = data?.details?.[dataPointIndex];
        const description = detail?.ligne?.description?.[0] || "";
        const designation = detail?.ligne?.designation || "";
        const val = series[seriesIndex][dataPointIndex];

        return `
          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 shadow-2xl rounded-2xl max-w-xs">
            <div class="flex flex-col gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white leading-tight">${designation}</span>
              ${description ? `<span class="text-xs text-gray-600 dark:text-gray-400">${description}</span>` : ''}
              <span class="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">${val.toLocaleString()} $</span>
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="text-xs text-red-500 font-medium">🗑️ Cliquez pour supprimer</span>
              </div>
            </div>
          </div>
        `;
      }
    },
  };

  const series = [
    {
      name: "Prévu",
      data: data?.details?.map((detail: any) => detail.credit || 0) || [],
    },
  ];

  const fetchLignes = async () => {
    try {
      const response = await fetch('/api/depenses/lignes');
      const result = await response.json();

      const { success, data: lignesData } = result;
      if (success) {
        setAvailableLignes(lignesData);
        return lignesData;
      } else {
        setAvailableLignes([]);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des lignes:", error);
      setAvailableLignes([]);
      return [];
    }
  };

  const handleSubmitDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDetail.ligne || formDetail.credit <= 0) return;

    setIsSubmitting(true);
    try {
      // Here you would typically update the budget with the new detail
      console.log("Adding detail:", formDetail);
      const details = data?.details || [];
      details.push({
        ligne: availableLignes.find(l => l._id === formDetail.ligne),
        credit: formDetail.credit
      });
      
      const req = await fetch(`/api/depenses/budget/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          details
        })
      });
      if (req.ok) {
        const res = await req.json();
        const { success, data: updatedBudget } = res;
        if (success) {
          // Update local data
          data.details = updatedBudget.details;
        }
      }
      // Reset form
      setFormDetail({ ligne: "", credit: 0 });
      setShowDetailForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du détail:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDetail = async (detailIndex: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ligne budgétaire ?")) return;

    setIsSubmitting(true);
    try {
      const details = [...(data?.details || [])];
      details.splice(detailIndex, 1);
      
      const req = await fetch(`/api/depenses/budget/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          details
        })
      });
      
      if (req.ok) {
        const res = await req.json();
        const { success, data: updatedBudget } = res;
        if (success) {
          // Update local data
          data.details = updatedBudget.details;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du détail:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const renderForm = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ajouter une ligne budgétaire
        </h4>
        
        <form onSubmit={handleSubmitDetail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ligne Opérationnelle *
            </label>
            <select
              value={formDetail.ligne}
              onChange={(e) => setFormDetail({ ...formDetail, ligne: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une ligne</option>
              {availableLignes.map((ligne: any) => (
                <option key={ligne._id} value={ligne._id}>
                  {ligne.designation}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Crédit alloué (USD) *
            </label>
            <input
              type="number"
              value={formDetail.credit}
              onChange={(e) => setFormDetail({ ...formDetail, credit: parseFloat(e.target.value) || 0 })}
              placeholder="Entrez le montant du crédit"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={toggleForm}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              disabled={isSubmitting || !formDetail.ligne || formDetail.credit <= 0}
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 p-7 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <div className="w-24 h-24 bg-blue-500 rounded-full blur-[60px]"></div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {data?.designation || "Prévisions Budgétaires"}
          </h3>
          <p className="text-xs text-gray-400 font-medium italic">
            Répartition des crédits par ligne opérationnelle
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-100/50 dark:border-blue-900/30">
            Total: {(data?.montant || 0).toLocaleString()} $
          </div>
          
          <Button
            onClick={toggleForm}
            className={`text-xs px-3 py-2 ${showDetailForm ? "outline" : "default"}`}
          >
            <PlusIcon className="w-3 h-3 mr-1" />
            {showDetailForm ? "Voir Graphique" : "Ajouter Ligne"}
          </Button>
        </div>
      </div>

      {showDetailForm ? (
        renderForm()
      ) : (
        <div className="w-full">
          {data?.details?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-100 dark:border-blue-900/20 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Ajoutez des lignes budgétaires pour voir le graphique</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full inline-block">
                  💡 Cliquez sur une barre pour supprimer la ligne budgétaire
                </p>
              </div>
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={280}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
