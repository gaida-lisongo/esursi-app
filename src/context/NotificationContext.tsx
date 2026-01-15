"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    notifications: Notification[];
    showNotification: (message: string, type?: NotificationType) => void;
    hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, type, message }]);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(id);
        }, 5000);
    }, []);

    const hideNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {notifications.map((n) => (
                    <Toast key={n.id} notification={n} onClose={() => hideNotification(n.id)} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

const Toast: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
    }[notification.type];

    return (
        <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] animate-slide-in-right`}>
            <p className="text-sm font-medium">{notification.message}</p>
            <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
