"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { Metrique } from "../etablissement/Dashboard";

export const Metrics = ({ data }: { data: Metrique[] }) => {
  console.log("Stat Paiement : ", data);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {
        data?.map((item: Metrique, key: number) => (
          <div key={key} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {item.icon}
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {item.value}$
                </h4>
              </div>
              <Badge color={item.status == 'up' ? 'success' : 'warning'}>
                {item.status == 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {item.proportion * 100}%
              </Badge>
            </div>
          </div>
        ))
      }
    </div>
  );
};
