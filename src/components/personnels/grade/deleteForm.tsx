"use client";

import React from "react";
import { deleteGrade } from "@/lib/actions/personnels/grade/deleteGrade";
import { useNotification } from "@/context/NotificationContext";

interface GradeItem {
    id: string;
    code: string;
    designation: string;
    personnel: "PAS" | "PATO";
}

interface DeleteFormProps {
    item: GradeItem;
    onClose?: () => void;
}

export const DeleteGradeForm = ({ item, onClose }: DeleteFormProps) => {
    const { showNotification } = useNotification();
    async function handleAction() {
        const res = await deleteGrade(item.id);

        if (!res.success) {
            showNotification(`Erreur suppression : ${res.message}`, "error");
        } else {
            onClose?.();
        }
    }

    return (
        <div className="flex flex-col gap-4 p-6 border rounded-xl bg-white dark:bg-gray-800">
            <h4 className="font-semibold text-lg text-red-600">Confirmer la suppression</h4>
            <p>
                Êtes-vous sûr de vouloir supprimer le grade <strong>{item.designation}</strong> ?
            </p>
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                    Annuler
                </button>
                <button
                    onClick={handleAction}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Confirmer la suppression
                </button>
            </div>
        </div>
    );
};
