'use server';

import dbConnect from '@/lib/connect';
import Province from '@/lib/models/Province';
import { revalidatePath } from 'next/cache';

type CreateProvinceInput = {
    designation: string;
    code: string;
    description?: string;
};

export async function createProvince(input: CreateProvinceInput) {
    try {
        await dbConnect();

        const exists = await Province.findOne({ code: input.code });
        if (exists) {
            return {
                success: false,
                message: 'Une province avec ce code existe déjà',
            };
        }

        const province = await Province.create({
            ...input,
            actif: true,
        });

        revalidatePath('/provinces');

        return {
            success: true,
            message: 'Province créée avec succès',
            data: {
                id: province._id.toString(),
            },
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Erreur lors de la création',
        };
    }
}
