"use server";

import Grade from "@/lib/models/Grade";
import dbConnect from "@/lib/connect";
import { revalidatePath } from "next/cache";


export async function deleteGrade(gradeId: string) {
    try {
        await dbConnect();
        const grade = await Grade.findById(gradeId);
        if (!grade) return { success: false, message: "Grade non trouvé" };

        await Grade.findByIdAndDelete(gradeId);

        revalidatePath("/(admin)/(personnel)/grades");

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur suppression grade" };
    }
}