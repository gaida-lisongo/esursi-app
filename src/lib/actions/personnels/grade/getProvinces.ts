'use server';

import dbConnect from '@/lib/connect';
import Province from '@/lib/models/Province';

export async function getProvinces() {
    try {
        await dbConnect();

        const provinces = await Province.find()
            .sort({ designation: 1 })
            .lean();

        return {
            success: true,
            data: provinces.map((p) => ({
                id: p._id.toString(),
                designation: p.designation,
                code: p.code,
                description: p.description,
                actif: p.actif,
            })),
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Erreur lors du chargement',
        };
    }
}
