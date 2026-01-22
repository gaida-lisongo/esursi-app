"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useEffect } from "react";

export function useAuthCheck() {
  const { token, user, isAuthenticated } = useAdminStore();

  useEffect(() => {
    // Vérifier si nous avons un cookie admin_token côté client
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        // Si nous avons un token dans le store mais pas d'utilisateur,
        // cela peut indiquer un problème de synchronisation
        if (token && !user) {
          console.log('Token found but no user data, might need to sync');
        }
        
        // Si nous avons un utilisateur mais le store n'est pas marqué comme authentifié,
        // corriger l'état
        if (user && token && !isAuthenticated) {
          console.log('User and token found but not marked as authenticated, correcting state');
          // Cette correction sera gérée par Zustand persist
        }
      }
    };

    checkAuthStatus();
  }, [token, user, isAuthenticated]);

  return { isAuthenticated, user, token };
}

export default useAuthCheck;