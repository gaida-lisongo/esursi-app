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
        return { success: true, data: grade };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur création grade" };
    }
}