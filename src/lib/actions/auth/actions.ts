"use server";

import dbConnect from "@/lib/connect";
import Admin from "@/lib/models/Admin";
import Agent from "@/lib/models/Agent";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import Mail from "@/lib/utils/Mail";

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

        const userData = JSON.parse(JSON.stringify({
            id: admin._id,
            agent: agent,
            name: `${agent.nom} ${agent.prenom}`,
            email: agent.email,
            role: admin.role,
            photo: agent.photo
        }));

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

export async function recoverPassword(identifier: string) {
    try {
        await dbConnect();

        // 1. Trouver l'agent
        const agent = await Agent.findOne({
            $or: [{ email: identifier }, { matricule: identifier }]
        }).lean();

        if (!agent) {
            return { success: false, message: "Aucun compte trouvé avec cet identifiant" };
        }

        if (!agent.email) {
            return { success: false, message: "Cet agent n'a pas d'adresse email configurée. Contactez le Super Admin." };
        }

        // 2. Trouver l'admin
        const adminDoc = await Admin.findOne({ agentId: agent._id });

        if (!adminDoc) {
            return { success: false, message: "Vous n'avez pas de droits administratifs" };
        }

        // 3. Générer un nouveau mot de passe
        const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
        const hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");

        // 4. Mettre à jour en base
        adminDoc.password = hashedPassword;
        await adminDoc.save();

        // 5. Envoyer le mail
        const subject = "Récupération de compte - ESURSI-APP";
        const textBody = `Bonjour ${agent.nom} ${agent.prenom},\n\nVotre mot de passe a été réinitialisé.\nVoici votre nouveau mot de passe temporaire : ${newPassword}\n\nVeuillez le changer dès votre prochaine connexion.\n\nL'équipe ESURSI-APP.`;

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #3641f5;">ESURSI-APP</h2>
                <p>Bonjour <strong>${agent.nom} ${agent.prenom}</strong>,</p>
                <p>Votre mot de passe a été réinitialisé avec succès.</p>
                <div style="background: #f4f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #161950;">${newPassword}</span>
                </div>
                <p>Veuillez utiliser ce mot de passe temporaire pour vous connecter et le changer immédiatement dans vos paramètres.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">Ceci est un message automatique, veuillez ne pas y répondre.</p>
            </div>
        `;

        await Mail.sendMail(agent.email, subject, textBody, htmlBody);

        return { success: true, message: `Un nouveau mot de passe a été envoyé à : ${agent.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}` };

    } catch (error: any) {
        console.error("Erreur récupération mot de passe:", error);
        return { success: false, message: "Une erreur est survenue lors de l'envoi du mail." };
    }
}

export async function logoutAdmin() {
    (await cookies()).delete("admin_token");
    return { success: true };
}
