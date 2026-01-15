import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFaculte extends Document {
    designation: string;
    description?: string[];
    programmes: Schema.Types.ObjectId[];
    etablissement: Schema.Types.ObjectId;
}

export interface IEtablissement extends Document {
    sigle: string;
    designation: string;
    description?: string[];
    website?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    photo?: string[];
    nRef?: { document: string, date: string, reference: string }[];
    coge?: {
        fonction: string;
        agent: Schema.Types.ObjectId;
    }[];
    rapports?: {
        titre: string;
        document: string;
        date: string;
        annee: Schema.Types.ObjectId;
    }[];
    actif: boolean;
}

const EtablissementSchema: Schema = new Schema<IEtablissement>({
    sigle: { type: String, required: true },
    designation: { type: String, required: true },
    description: [{ type: String }],
    website: { type: String },
    email: { type: String },
    telephone: { type: String },
    adresse: { type: String },
    photo: [{ type: String }],
    nRef: [{ document: { type: String, required: true }, date: { type: String, required: true }, reference: { type: String, required: true } }],
    coge: [{
        fonction: { type: String, required: true },
        agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    }],
    rapports: [{
        titre: { type: String, required: true },
        document: { type: String, required: true },
        date: { type: String, required: true },
        annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    }],
    actif: { type: Boolean, default: true },
});

const FaculteSchema: Schema = new Schema<IFaculte>({
    designation: { type: String, required: true },
    description: [{ type: String }],
    programmes: [{ type: Schema.Types.ObjectId, ref: 'Programme', required: true }],
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
});

const Etablissement: Model<IEtablissement> = mongoose.models.Etablissement || mongoose.model<IEtablissement>('Etablissement', EtablissementSchema);
const Faculte: Model<IFaculte> = mongoose.models.Faculte || mongoose.model<IFaculte>('Faculte', FaculteSchema);
export {
    Etablissement,
    Faculte
}
