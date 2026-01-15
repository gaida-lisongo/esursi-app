"use client";

import React from "react";
import { createProvince } from "@/lib/actions/personnels/grade/createProvince";
import { updateProvince } from "@/lib/actions/personnels/grade/updateProvince";
import { deleteProvince } from "@/lib/actions/personnels/grade/deleteProvince";

type ProvinceItem = {
    id: string;
    code: string;
    designation: string;
    description?: string;
    actif: boolean;
};

interface FormProps {
    onClose?: () => void;
}

interface ItemFormProps extends FormProps {
    item: ProvinceItem;
}

export const CreateProvinceForm = ({ onClose }: FormProps) => {
    async function handleAction(formData: FormData) {
        const designation = formData.get("designation") as string;
        const code = formData.get("code") as string;
        const description = formData.get("description") as string | undefined;

        const res = await createProvince({ designation, code, description });

        if (!res.success) {
            alert(`Erreur création : ${res.message}`);
        } else {
            alert("Province créée avec succès !");
            onClose?.();
        }
    }

    return (
        <form action={handleAction} className="flex flex-col gap-4 p-4 border rounded-xl bg-white dark:bg-gray-800">
            <h4 className="font-semibold text-lg">Ajouter une Province</h4>
            <div className="grid grid-cols-1 gap-4">
                <input name="code" placeholder="Code (ex: LUA)" required className="p-2 border rounded dark:bg-gray-700" />
                <input name="designation" placeholder="Désignation (ex: Lualaba)" required className="p-2 border rounded dark:bg-gray-700" />
                <textarea name="description" placeholder="Description" className="p-2 border rounded dark:bg-gray-700" />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Créer</button>
            </div>
        </form>
    );
};

export const UpdateProvinceForm = ({ item, onClose }: ItemFormProps) => {
    async function handleAction(formData: FormData) {
        const designation = formData.get("designation") as string;
        const code = formData.get("code") as string;
        const description = formData.get("description") as string | undefined;
        const actif = formData.get("actif") === "on";

        const res = await updateProvince({
            provinceId: item.id,
            designation,
            code,
            description,
            actif,
        });

        if (!res.success) {
            alert(`Erreur mise à jour : ${res.message}`);
        } else {
            alert("Province mise à jour avec succès !");
            onClose?.();
        }
    }

    return (
        <form action={handleAction} className="flex flex-col gap-4 p-4 border rounded-xl bg-white dark:bg-gray-800">
            <h4 className="font-semibold text-lg">Modifier la Province</h4>
            <div className="grid grid-cols-1 gap-4">
                <input name="code" defaultValue={item.code} placeholder="Code" required className="p-2 border rounded dark:bg-gray-700" />
                <input name="designation" defaultValue={item.designation} placeholder="Désignation" required className="p-2 border rounded dark:bg-gray-700" />
                <textarea name="description" defaultValue={item.description || ""} placeholder="Description" className="p-2 border rounded dark:bg-gray-700" />
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="actif" defaultChecked={item.actif} />
                    Actif
                </label>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Mettre à jour</button>
            </div>
        </form>
    );
};

export const DeleteProvinceForm = ({ item, onClose }: ItemFormProps) => {
    async function handleAction() {
        const res = await deleteProvince(item.id);

        if (!res.success) {
            alert(`Erreur suppression : ${res.message}`);
        } else {
            alert("Province désactivée avec succès !");
            onClose?.();
        }
    }

    return (
        <div className="flex flex-col gap-4 p-6 border rounded-xl bg-white dark:bg-gray-800">
            <h4 className="font-semibold text-lg text-red-600">Confirmer la suppression</h4>
            <p>Êtes-vous sûr de vouloir désactiver la province <strong>{item.designation}</strong> ?</p>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700">Annuler</button>
                <button onClick={handleAction} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirmer la désactivation</button>
            </div>
        </div>
    );
};
