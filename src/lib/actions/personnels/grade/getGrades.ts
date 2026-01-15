// getGrades.ts
import Grade from "@/lib/models/Grade";
import dbConnect from '@/lib/connect';

export async function getGrades() {
    try {
        await dbConnect();
        const grades = await Grade.find({ actif: { $ne: false } }).lean();
        return { success: true, data: grades };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lecture grades" };
    }
}
