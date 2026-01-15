'use server';
import Grade from "@/lib/models/Grade";
import dbConnect from '@/lib/connect';

export async function getGrades() {
    try {
        await dbConnect();
        const grades = await Grade.find({ actif: { $ne: false } }).lean();

        // Convert to plain objects with string IDs
        return {
            success: true,
            data: grades.map((g: any) => ({
                ...g,
                id: g._id.toString(),
                _id: g._id.toString()
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lecture grades" };
    }
}
