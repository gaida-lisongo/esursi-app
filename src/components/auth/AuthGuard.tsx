"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, token } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Petit délai pour permettre à Zustand de charger l'état depuis le localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Si pas authentifié ou pas de token, rediriger vers signin
      if (!isAuthenticated || !token || !user) {
        console.log('AuthGuard: User not authenticated, redirecting to signin from', pathname);
        router.replace('/signin');
      } else {
        console.log('AuthGuard: User authenticated as', user.nom);
      }
    }, 200); // Augmenté le délai pour une meilleure stabilité

    return () => clearTimeout(timer);
  }, [isAuthenticated, token, user, router, pathname]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (la redirection est en cours)
  if (!isAuthenticated || !token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirection...</p>
        </div>
      </div>
    );
  }

  // Utilisateur authentifié, afficher le contenu
  return <>{children}</>;
}