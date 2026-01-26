"use server";

import dbConnect from "@/lib/connect";
import { Etablissement } from "@/lib/models/Etablissement";
import Province from "@/lib/models/Province";
import { Annee } from "@/lib/models";

export async function getEtablissementsByProvince(provinceId: string) {
    try {
        await dbConnect();
        const items = await Etablissement.find({ province: provinceId as any }).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)).map((i: any) => ({
                ...i,
                id: i._id.toString()
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getProvinceDetails(id: string) {
    try {
        await dbConnect();
        const item = await Province.findById(id).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getAnneeById(id: string) {
    try {
        await dbConnect();
        const item = await Annee.findById(id).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getEtablissementById(id: string) {
    try {
        await dbConnect();
        const item = await Etablissement.findById(id)
            .populate("province")
            .populate("coge.agent")
            .populate("rapports.annee")
            .lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
