import React from "react";

export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    }[size];

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses} border-blue-600 border-t-transparent rounded-full animate-spin`}
                role="status"
                aria-label="Chargement..."
            >
                <span className="sr-only">Chargement...</span>
            </div>
        </div>
    );
}
