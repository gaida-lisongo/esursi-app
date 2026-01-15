'use server';

import dbConnect from '@/lib/connect';
import Province from '@/lib/models/Province';
import { revalidatePath } from 'next/cache';

export async function deleteProvince(provinceId: string) {
    try {
        await dbConnect();

        const province = await Province.findById(provinceId);
        if (!province) {
            return {
                success: false,
                message: 'Province introuvable',
            };
        }

        province.actif = false;
        await province.save();
        revalidatePath('/provinces');

        return {
            success: true,
            message: 'Province désactivée avec succès',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Erreur lors de la suppression',
        };
    }
}
