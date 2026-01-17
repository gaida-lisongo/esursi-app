"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RevenuChart({
  data
}: { data: any }) {
  console.log("Data Chart: ", data);

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
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 shadow-2xl rounded-2xl">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">${description}</span>
              <span className="text-[14px] font-black text-gray-900 dark:text-white mt-1">${val.toLocaleString()} $</span>
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
        </div>
      </div>

      <div className="w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={280}
        />
      </div>
    </div>
  );
}
