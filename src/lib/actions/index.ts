"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/connect";
import Affectation from "@/lib/models/Affectation";

const updateAffectation = async (id: string, formData: any) => {
    try {
        await dbConnect();
        const affectation = await Affectation.findByIdAndUpdate(id, formData);
        revalidatePath('/affectations');
        return { success: true, message: 'Affectation updated successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update affectation' };
    }
};

const deleteAffectation = async (id: string) => {
    try {
        await dbConnect();
        const affectation = await Affectation.findByIdAndUpdate(id, { actif: false });
        revalidatePath('/affectations');
        return { success: true, message: 'Affectation deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete affectation' };
    }
};

export {
        updateAffectation,
    deleteAffectation
}