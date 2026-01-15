import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IQuota extends Document {
    designation: string;
    description?: string[];
    montant: number;
}

export interface IFrais extends Document {
    designation: string;
    categorie: string;
    description?: string;
    montant: number;
    annee: Schema.Types.ObjectId;
    repartition?: Schema.Types.ObjectId[];
    actif: boolean;
}

const QuotaSchema: Schema = new Schema<IQuota>({
    designation: { type: String, required: true },
    description: [{ type: String }],
    montant: { type: Number, required: true },
});

const FraisSchema: Schema = new Schema<IFrais>({
    designation: { type: String, required: true },
    categorie: { type: String, required: true },
    description: [{ type: String }],
    montant: { type: Number, required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    repartition: [{ type: Schema.Types.ObjectId, ref: 'Quota' }],
    actif: { type: Boolean, default: true },
});

const Quota: Model<IQuota> = mongoose.models.Quota || mongoose.model<IQuota>('Quota', QuotaSchema);
const Frais: Model<IFrais> = mongoose.models.Frais || mongoose.model<IFrais>('Frais', FraisSchema);
export {
    Quota,
    Frais
}