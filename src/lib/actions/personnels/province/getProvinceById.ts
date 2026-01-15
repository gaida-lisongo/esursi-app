'use server';

import dbConnect from '@/lib/connect';
import Province from '@/lib/models/Province';

export async function getProvinceById(provinceId: string) {
    try {
        await dbConnect();

        const province = await Province.findById(provinceId).lean();

        if (!province) {
            return {
                success: false,
                message: 'Province introuvable',
            };
        }

        return {
            success: true,
            data: {
                id: province._id.toString(),
                designation: province.designation,
                code: province.code,
                description: province.description,
                actif: province.actif,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Erreur lors du chargement',
        };
    }
}
