"use server";

import dbConnect from "@/lib/connect";
import Admin from "@/lib/models/Admin";
import Agent from "@/lib/models/Agent";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-12345";

export async function loginAdmin(identifier: string, password: string) {
    try {
        await dbConnect();

        // Find agent by email or matricule
        const agent = await Agent.findOne({
            $or: [{ email: identifier }, { matricule: identifier }]
        }).lean();

        if (!agent) {
            return { success: false, message: "Identifiants incorrects" };
        }

        // Find admin record for this agent
        const admin = await Admin.findOne({ agentId: agent._id }).lean();

        if (!admin) {
            return { success: false, message: "Vous n'avez pas de droits administratifs" };
        }

        // Hash the input password to compare
        const hashedInput = crypto.createHash("sha256").update(password).digest("hex");

        if (hashedInput !== admin.password) {
            return { success: false, message: "Identifiants incorrects" };
        }

        // Generate JWT
        const token = jwt.sign(
            {
                adminId: admin._id,
                agentId: agent._id,
                role: admin.role,
                name: `${agent.nom} ${agent.prenom}`
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Optional: set cookie
        (await cookies()).set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 // 1 day
        });

        const userData = {
            id: admin._id.toString(),
            agent: agent,
            name: `${agent.nom} ${agent.prenom}`,
            email: agent.email,
            role: admin.role,
            photo: agent.photo
        };

        return {
            success: true,
            message: "Connexion réussie",
            token,
            user: userData
        };

    } catch (error: any) {
        return { success: false, message: error.message || "Erreur lors de la connexion" };
    }
}

export async function logoutAdmin() {
    (await cookies()).delete("admin_token");
    return { success: true };
}
