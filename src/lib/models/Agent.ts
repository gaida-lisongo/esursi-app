import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAgent extends Document {
    nom: string;
    postNom: string;
    prenom: string;
    dateNaissance: Date;
    lieuNaissance: string;
    nationalite: string;
    sexe: string;
    adresse: string;
    telephone: string;
    email: string;
    grade: Schema.Types.ObjectId;
    province: Schema.Types.ObjectId;
    actif: boolean;
    photo?: string;
    matricule: string;
    autorisation: {
        role: string;
        secureKey: string;
        status: 'OK' | 'PENDING' | 'NO'
    }[];
    action: boolean;
}

const AgentSchema: Schema = new Schema({
    nom: { type: String, required: true },
    postNom: { type: String, required: true },
    prenom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    lieuNaissance: { type: String, required: true },
    nationalite: { type: String, required: true },
    sexe: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    grade: { type: Schema.Types.ObjectId, ref: 'Grade', required: true },
    province: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
    actif: { type: Boolean, default: true },
    photo: { type: String },
    matricule: { type: String, required: true },
    autorisation: [{
        role: { type: String, required: true },
        secureKey: { type: String, required: true },
        status: { type: String, enum: ['OK', 'PENDING', 'NO'], default: 'PENDING' },
    }],
    action: { type: Boolean, default: true },
});

const Agent: Model<IAgent> = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);

export default Agent;
