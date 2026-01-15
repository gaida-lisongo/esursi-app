"use server";

import Grade from "@/lib/models/Grade";
import dbConnect from "@/lib/connect";
import { revalidatePath } from "next/cache";


interface UpdateGradeInput {
    gradeId: string;
    designation: string;
    code: string;
    personnel: "PAS" | "PATO";
}

export async function updateGrade(data: UpdateGradeInput) {
    try {
        await dbConnect();
        const grade = await Grade.findById(data.gradeId);
        if (!grade) return { success: false, message: "Grade non trouvé" };

        grade.designation = data.designation;
        grade.code = data.code;
        grade.personnel = data.personnel;

        await grade.save();

        revalidatePath("/(admin)/(personnel)/grades");

        const result = grade.toObject();
        return {
            success: true,
            data: {
                ...result,
                id: result._id.toString(),
                _id: result._id.toString()
            }
        };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur mise à jour grade" };
    }
}