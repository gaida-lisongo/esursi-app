import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Etablissement, IEtablissement } from "@/lib/models/Etablissement";
import { IAgent } from "@/lib/models/Agent";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-12345";


export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { agentId, secureKey, role } = await request.json();
        const id = params.id;

        // Define the shape of the populated establishment
        type PopulatedEtablissement = Omit<IEtablissement, 'coge'> & {
            coge: {
                fonction: string;
                agent: IAgent;
            }[];
        };

        const etablissement = await Etablissement.findById(id).populate("coge.agent").lean() as unknown as PopulatedEtablissement;

        if (!etablissement) {
            return NextResponse.json({ success: false, error: "Etablissement non trouvé" }, { status: 404 });
        }

        const profiles = [
            {
                fonction: "Directeur Général",
                auth: "DG"
            },
            {
                fonction: "Secrétaire Général Académique",
                auth: "SGACAD"
            },
            {
                fonction: "Secrétaire Général Administratif",
                auth: "SGAD"
            },
            {
                fonction: "Secrétaire Général à la Recherche",
                auth: "SGR"
            },
            {
                fonction: "Administrateur du Budget",
                auth: "AB"
            }
        ]

        const profile = profiles.find((profile) => profile.fonction === role);
        if (!profile) {
            return NextResponse.json({ success: false, error: "Profil non trouvé" }, { status: 404 });
        }

        // Ensure coge exists
        if (!etablissement.coge) {
            return NextResponse.json({ success: false, error: "Aucun membre du comité trouvé" }, { status: 404 });
        }

        const coge = etablissement.coge.find((coge) => coge.agent._id.toString() === agentId);
        if (!coge) {
            return NextResponse.json({ success: false, error: "Agent non trouvé dans le comité" }, { status: 404 });
        }

        const { fonction, agent } = coge;

        const autorisation = agent.autorisation.find((autorisation) => autorisation.role === profile.auth && autorisation.status === "OK" && autorisation.secureKey === secureKey);
        if (!autorisation) {
            return NextResponse.json({ success: false, error: "Autorisation non trouvée ou invalide" }, { status: 404 });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                etabId: etablissement._id,
                agentId: agent._id,
                role: profile.auth,
                fonction: fonction
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return NextResponse.json({ success: true, token, etablissement });
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}