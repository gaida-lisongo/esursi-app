import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESURSI-APP | Ministère de l'Enseignement Supérieur",
  description: "Plateforme de suivi des flux et centralisation des informations des établissements d'enseignement supérieur en RDC. Vue à 360° de la recherche et de l'innovation.",
  keywords: ["ESURSI", "ESU", "Enseignement Supérieur", "RDC", "Congo", "Recherche Scientifique", "Innovation"],
  authors: [{ name: "Ministère de l'Enseignement Supérieur et Universitaire" }],
  openGraph: {
    title: "ESURSI-APP",
    description: "Plateforme de suivi des flux et centralisation des informations des établissements d'enseignement supérieur en RDC.",
    type: "website",
    locale: "fr_CD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <NotificationProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
