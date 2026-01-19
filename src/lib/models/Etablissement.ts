import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFaculte extends Document {
    designation: string;
    description?: string[];
    programmes: Schema.Types.ObjectId[];
    mention: Schema.Types.ObjectId;
    equipe: [{
        agent: Schema.Types.ObjectId;
        fonction: string;
    }];
    actualites: [{
        titre: string;
        sousTitre: string;
        description: string;
        photo: string;
        isActif: boolean;
    }];
    couverture: string;
    filieres: string[];
}

export interface IMention extends Document {
    designation: string;
    etablissement: Schema.Types.ObjectId;
    domaine: Schema.Types.ObjectId;
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
    province: Schema.Types.ObjectId;
}

const EtablissementSchema: Schema = new Schema<IEtablissement>({
    sigle: { type: String, required: true },
    designation: { type: String, required: true },
    description: [{ type: String }],
    website: { type: String },
    email: { type: String },
    telephone: { type: String },
    adresse: { type: String },
    province: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
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

const MentionSchema: Schema = new Schema<IMention>({
    designation: { type: String, required: true },
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
    domaine: { type: Schema.Types.ObjectId, ref: 'Domaine', required: true },
});

const FaculteSchema: Schema = new Schema<IFaculte>({
    designation: { type: String, required: true },
    description: [{ type: String }],
    programmes: [{ type: Schema.Types.ObjectId, ref: 'Programme', required: true }],
    mention: { type: Schema.Types.ObjectId, ref: 'Mention', required: true },
    equipe: [{
        agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
        fonction: { type: String, required: true },
    }],
    actualites: [{
        titre: { type: String, required: true },
        sousTitre: { type: String, required: true },
        description: { type: String, required: true },
        photo: { type: String, required: true },
        isActif: { type: Boolean, default: true },
    }],
    couverture: { type: String, required: false },
    filieres: [{ type: String }],
}, { timestamps: true });

const Etablissement: Model<IEtablissement> = mongoose.models.Etablissement || mongoose.model<IEtablissement>('Etablissement', EtablissementSchema);
const Mention: Model<IMention> = mongoose.models.Mention || mongoose.model<IMention>('Mention', MentionSchema);
const Faculte: Model<IFaculte> = mongoose.models.Faculte || mongoose.model<IFaculte>('Faculte', FaculteSchema);
export {
    Etablissement,
    Faculte,
    Mention
}
