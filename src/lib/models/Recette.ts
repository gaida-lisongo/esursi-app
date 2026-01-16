import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITranche extends Document {
    designation: string;
    montant: number;
    frais: Schema.Types.ObjectId;
    description?: string[];
}
export interface IPaiement extends Document {
    etudiant: Schema.Types.ObjectId;
    montant: number;
    date: string;
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
})

const Tranche: Model<ITranche> = mongoose.models.Tranche || mongoose.model<ITranche>('Tranche', TrancheSchema);

const PaiementSchema: Schema = new Schema({
    etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    montant: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'PENDING' },
    orderNumber: { type: String, required: true },
    tranche: { type: Schema.Types.ObjectId, ref: 'Tranche', required: true },
    description: [{ type: String }],
});

const Paiement: Model<IPaiement> = mongoose.models.Paiement || mongoose.model<IPaiement>('Paiement', PaiementSchema);

export {
    Paiement,
    Tranche
}
