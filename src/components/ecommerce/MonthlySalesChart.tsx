"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart({
  data
}: { data: any[] }) {

  // Transform data for chart
  const categories = data.map(role => role.auth || role.fonction);
  const seriesData = data.map(role => role.etablissements?.length || 0);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      // markers: {
      //   // radius: 99,
      //   width: 12,
      //   height: 12,
      // },
    },
    yaxis: {
      title: {
        text: "Nombre d'établissements",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
    grid: {
      strokeDashArray: 7,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: function (val) {
          return val + " établissement" + (val > 1 ? "s" : "");
        },
      },
    },
  };

  const series = [
    {
      name: "Établissements",
      data: seriesData,
    },
  ];

  return (
    <div className="col-span-12 rounded-3xl border border-gray-200 bg-white px-7.5 pb-6 pt-7.5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-7">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Mes établissements
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
}
