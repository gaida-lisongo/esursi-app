"use server";

import Grade from "@/lib/models/Grade";
import dbConnect from "@/lib/connect";

interface CreateGradeInput {
    designation: string;
    code: string;
    personnel: "PAS" | "PATO";
}

export async function createGrade(data: CreateGradeInput) {
    try {
        await dbConnect();
        const grade = new Grade(data);
        await grade.save();

        // Convert to plain object and flatten _id
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
        return { success: false, message: error.message || "Erreur création grade" };
    }
}