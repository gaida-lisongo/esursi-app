import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITranche extends Document {
    designation: string;
    montant: number;
    frais: Schema.Types.ObjectId;
    description?: string[];
}

export interface IInscription extends Document {
    etablissement: Schema.Types.ObjectId;
    annee: Schema.Types.ObjectId;
    tranche: Schema.Types.ObjectId;
    programme: Schema.Types.ObjectId;
    description?: string[];
    actif: boolean;
}

export interface IMinerval extends Document {
    etablissement: Schema.Types.ObjectId;
    annee: Schema.Types.ObjectId;
    tranche: Schema.Types.ObjectId;
    description?: string[];
    actif: boolean;
}

export interface IPaiement extends Document {
    etudiant: Schema.Types.ObjectId;
    montant: number;
    status: 'NO' | 'PENDING' | 'OK';
    orderNumber: string;
    tranche: Schema.Types.ObjectId;
    description?: string[];
}

const TrancheSchema: Schema = new Schema({
    designation: { type: String, required: true },
    montant: { type: Number, required: true },
    frais: { type: Schema.Types.ObjectId, ref: 'Frais', required: true },
    description: [{ type: String }],
}, {
    timestamps: true
})

const Tranche: Model<ITranche> = mongoose.models.Tranche || mongoose.model<ITranche>('Tranche', TrancheSchema);

const PaiementSchema: Schema = new Schema({
    etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    montant: { type: Number, required: true },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'PENDING' },
    orderNumber: { type: String, required: true },
    tranche: { type: Schema.Types.ObjectId, ref: 'Tranche', required: true },
    description: [{ type: String }],
}, {
    timestamps: true
});

const InscriptionSchema: Schema = new Schema({
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    tranche: { type: Schema.Types.ObjectId, ref: 'Tranche', required: true },
    programme: { type: Schema.Types.ObjectId, ref: 'Programme', required: true },
    description: [{ type: String }],
    actif: { type: Boolean, default: true },
}, {
    timestamps: true
});

const MinervalSchema: Schema = new Schema({
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    tranche: { type: Schema.Types.ObjectId, ref: 'Tranche', required: true },
    description: [{ type: String }],
    actif: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Minerval: Model<IMinerval> = mongoose.models.Minerval || mongoose.model<IMinerval>('Minerval', MinervalSchema);

const Inscription: Model<IInscription> = mongoose.models.Inscription || mongoose.model<IInscription>('Inscription', InscriptionSchema);

const Paiement: Model<IPaiement> = mongoose.models.Paiement || mongoose.model<IPaiement>('Paiement', PaiementSchema);

export {
    Paiement,
    Tranche,
    Inscription,
    Minerval
}
