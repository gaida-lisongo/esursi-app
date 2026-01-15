'use server';

import dbConnect from '@/lib/connect';
import Province from '@/lib/models/Province';

type UpdateProvinceInput = {
    provinceId: string;
    designation?: string;
    code?: string;
    description?: string;
    actif?: boolean;
};

export async function updateProvince(input: UpdateProvinceInput) {
    try {
        await dbConnect();

        const province = await Province.findById(input.provinceId);
        if (!province) {
            return {
                success: false,
                message: 'Province introuvable',
            };
        }

        if (input.code && input.code !== province.code) {
            const codeExists = await Province.findOne({ code: input.code });
            if (codeExists) {
                return {
                    success: false,
                    message: 'Ce code est déjà utilisé',
                };
            }
        }

        Object.assign(province, input);
        await province.save();

        return {
            success: true,
            message: 'Province mise à jour avec succès',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Erreur lors de la mise à jour',
        };
    }
}
