"use server";

import dbConnect from "@/lib/connect";
import Agent from "@/lib/models/Agent";
import Province from "@/lib/models/Province";
import Grade from "@/lib/models/Grade";
import { revalidatePath } from "next/cache";

// Utility to generate matricule
function generateMatricule() {
    const ts = Date.now().toString().slice(-7);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];

    // Format X.XXX.XXX L
    const formatted = `${ts[0]}.${ts.slice(1, 4)}.${ts.slice(4, 7)} ${letter}`;
    return formatted;
}

export async function getAgents() {
    try {
        await dbConnect();
        // Only fetch agents where action is true
        const agents = await Agent.find({ action: true })
            .populate("province")
            .populate("grade")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(agents)).map((a: any) => ({
                ...a,
                id: a._id.toString(),
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors du chargement des agents" };
    }
}

export async function createAgent(formData: any) {
    try {
        await dbConnect();

        const matricule = generateMatricule();

        const agentData = {
            ...formData,
            matricule,
            action: true,
            actif: true,
        };

        const agent = new Agent(agentData);
        await agent.save();

        revalidatePath("/(admin)/(personnel)/agents");
        return { success: true, message: "Agent créé avec succès" };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors de la création de l'agent" };
    }
}

export async function updateAgent(agentId: string, formData: any) {
    try {
        await dbConnect();
        const agent = await Agent.findById(agentId);
        if (!agent) return { success: false, message: "Agent non trouvé" };

        Object.assign(agent, formData);
        await agent.save();

        revalidatePath("/(admin)/(personnel)/agents");
        return { success: true, message: "Agent mis à jour avec succès" };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors de la mise à jour" };
    }
}

export async function deleteAgent(agentId: string) {
    try {
        await dbConnect();
        const agent = await Agent.findById(agentId);
        if (!agent) return { success: false, message: "Agent non trouvé" };

        // Soft delete: toggle action to false
        agent.action = false;
        await agent.save();

        revalidatePath("/(admin)/(personnel)/agents");
        return { success: true, message: "Agent supprimé (désactivé) avec succès" };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors de la suppression" };
    }
}

export async function manageAuthorizations(agentId: string, autorisations: any[]) {
    try {
        await dbConnect();
        const agent = await Agent.findById(agentId);
        if (!agent) return { success: false, message: "Agent non trouvé" };

        agent.autorisation = autorisations;
        await agent.save();

        revalidatePath("/(admin)/(personnel)/agents");
        return { success: true, message: "Autorisations mises à jour" };
    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors de la mise à jour des autorisations" };
    }
}
