"use client";

import React from "react";
import { createGrade } from "@/lib/actions/personnels/grade/createGrade";
import { useNotification } from "@/context/NotificationContext";

interface CreateFormProps {
    onClose?: () => void;
}

export const CreateGradeForm = ({ onClose }: CreateFormProps) => {
    const { showNotification } = useNotification();
    async function handleAction(formData: FormData) {
        const designation = formData.get("designation") as string;
        const code = formData.get("code") as string;
        const personnel = formData.get("personnel") as "PAS" | "PATO";

        const res = await createGrade({ designation, code, personnel });

        if (!res.success) {
            showNotification(`Erreur création : ${res.message}`, "error");
        } else {
            onClose?.();
        }
    }

    return (
        <form
            action={handleAction}
            className="flex flex-col gap-4 p-4 border rounded-xl bg-white dark:bg-gray-800"
        >
            <h4 className="font-semibold text-lg">Ajouter un Grade</h4>

            <input
                name="code"
                placeholder="Code"
                required
                className="p-2 border rounded dark:bg-gray-700"
            />

            <input
                name="designation"
                placeholder="Désignation"
                required
                className="p-2 border rounded dark:bg-gray-700"
            />

            <select
                name="personnel"
                required
                className="p-2 border rounded dark:bg-gray-700"
                defaultValue="PAS"
            >
                <option value="PAS">PAS</option>
                <option value="PATO">PATO</option>
            </select>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Créer
                </button>
            </div>
        </form>
    );
};
