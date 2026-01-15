"use client";

import React from "react";
import { updateGrade } from "@/lib/actions/personnels/grade/updateGrade";
import { useNotification } from "@/context/NotificationContext";

interface GradeItem {
    id: string;
    code: string;
    designation: string;
    personnel: "PAS" | "PATO";
}

interface UpdateFormProps {
    item: GradeItem;
    onClose?: () => void;
}

export const UpdateGradeForm = ({ item, onClose }: UpdateFormProps) => {
    const { showNotification } = useNotification();
    async function handleAction(formData: FormData) {
        const designation = formData.get("designation") as string;
        const code = formData.get("code") as string;
        const personnel = formData.get("personnel") as "PAS" | "PATO";

        const res = await updateGrade({
            gradeId: item.id,
            designation,
            code,
            personnel,
        });

        if (!res.success) {
            showNotification(`Erreur mise à jour : ${res.message}`, "error");
        } else {
            onClose?.();
        }
    }

    return (
        <form
            action={handleAction}
            className="flex flex-col gap-4 p-4 border rounded-xl bg-white dark:bg-gray-800"
        >
            <h4 className="font-semibold text-lg">Modifier le Grade</h4>

            <input
                name="code"
                defaultValue={item.code}
                placeholder="Code"
                required
                className="p-2 border rounded dark:bg-gray-700"
            />

            <input
                name="designation"
                defaultValue={item.designation}
                placeholder="Désignation"
                required
                className="p-2 border rounded dark:bg-gray-700"
            />

            <select
                name="personnel"
                required
                defaultValue={item.personnel}
                className="p-2 border rounded dark:bg-gray-700"
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
                    Mettre à jour
                </button>
            </div>
        </form>
    );
};
