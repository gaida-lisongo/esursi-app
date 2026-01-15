import Grade from "@/lib/models/Grade";
import dbConnect from "@/lib/connect";


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

        return { success: true, data: grade };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur mise à jour grade" };
    }
}