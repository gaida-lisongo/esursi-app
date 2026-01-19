import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-12345";

export interface DecodedToken extends JwtPayload {
    etabId: string;
    agentId: string;
    role: string;
    fonction: string;
}

export const verifyEtablissementToken = (request: Request, etabId?: string): DecodedToken | null => {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        // If an establishment ID is provided, verify it matches the token
        if (etabId && decoded.etabId !== etabId) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
};

export const unauthorizedResponse = () => {
    return NextResponse.json(
        { success: false, error: "Non autorisé. Token invalide ou manquant." },
        { status: 401 }
    );
};
