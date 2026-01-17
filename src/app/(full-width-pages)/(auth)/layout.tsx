import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="relative lg:w-1/2 w-full h-full lg:grid items-center hidden overflow-hidden bg-brand-950">
            {/* Background Image */}
            <Image
              src="/images/background.jpeg"
              alt="Auth Background"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Mask Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-600/60 via-brand-900/80 to-gray-950/90"></div>

            <div className="relative flex flex-col items-center justify-center z-10 p-12 mt-100 text-center">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <div className="opacity-20">
                <GridShape />
              </div>

              <div className="max-w-md">
                <Link href="/" className="inline-block mb-10 transform hover:scale-105 transition-transform">
                  <span className="text-4xl font-extrabold text-white tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
                    ESURSI<span className="text-brand-300">-APP</span>
                  </span>
                </Link>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    Ministère de l'Enseignement Supérieur et Universitaire
                  </h2>
                  <p className="text-lg text-gray-200 leading-relaxed font-medium">
                    Suivez le flux et centralisez les informations de tous les établissements pour une vue à 360° de l'ensemble de la République Démocratique du Congo.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
