"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";

export default function AuthDebug() {
  const { user, token, isAuthenticated, isLoading } = useAdminStore();
  const [clientCookies, setClientCookies] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientCookies(document.cookie);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">Auth Debug Info</h4>
      <div className="space-y-1">
        <p><strong>isAuthenticated:</strong> {String(isAuthenticated)}</p>
        <p><strong>isLoading:</strong> {String(isLoading)}</p>
        <p><strong>hasUser:</strong> {String(!!user)}</p>
        <p><strong>hasToken:</strong> {String(!!token)}</p>
        <p><strong>userNom:</strong> {user?.nom || 'N/A'}</p>
        <p><strong>cookies:</strong> {clientCookies.includes('admin_token') ? '✅ admin_token present' : '❌ no admin_token'}</p>
        <p><strong>localStorage:</strong> {typeof window !== 'undefined' && localStorage.getItem('admin-storage') ? '✅ has data' : '❌ no data'}</p>
      </div>
    </div>
  );
}