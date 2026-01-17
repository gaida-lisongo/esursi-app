import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILigne extends Document {
    designation: string;
    description?: string[];
}

export interface IBudget extends Document {
    designation: string;
    etablissement: Schema.Types.ObjectId;
    montant: number;
    annee: Schema.Types.ObjectId;
    details?: { ligne: Schema.Types.ObjectId, credit: number }[];
}

export interface IPlanHebdo extends Document {
    designation: string;
    montant: number;
    lignes: Schema.Types.ObjectId[];
    pieces: string[];
    ordres: Schema.Types.ObjectId[];
    budget: Schema.Types.ObjectId;
}

export interface IOrdre extends Document {
    ligne: Schema.Types.ObjectId;
    beneficiaire: string;
    montant: number;
    description: string[];
    status: 'OK' | 'PENDING' | 'NO'
}

const LigneSchema: Schema = new Schema({
    designation: { type: String, required: true },
    description: [{ type: String }],
})

const BudgetSchema: Schema = new Schema({
    designation: { type: String, required: true },
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
    montant: { type: Number, required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    details: [{ ligne: { type: Schema.Types.ObjectId, ref: 'Ligne' }, credit: { type: Number } }]
})

const PlanHebdoSchema: Schema = new Schema({
    designation: { type: String, required: true },
    montant: { type: Number, required: true },
    lignes: [{ type: Schema.Types.ObjectId, ref: 'Ligne' }],
    pieces: [{ type: String }],
    ordres: [{ type: Schema.Types.ObjectId, ref: 'Ordre' }],
    budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
}, { timestamps: true })

const OrdreSchema: Schema = new Schema({
    ligne: { type: Schema.Types.ObjectId, ref: 'Ligne', required: true },
    beneficiaire: { type: String, required: true },
    montant: { type: Number, required: true },
    description: [{ type: String }],
    status: { type: String, enum: ['OK', 'PENDING', 'NO'], default: 'PENDING' },
}, { timestamps: true })

const Ligne: Model<ILigne> = mongoose.models.Ligne || mongoose.model<ILigne>('Ligne', LigneSchema);
const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
const PlanHebdo: Model<IPlanHebdo> = mongoose.models.PlanHebdo || mongoose.model<IPlanHebdo>('PlanHebdo', PlanHebdoSchema);
const Ordre: Model<IOrdre> = mongoose.models.Ordre || mongoose.model<IOrdre>('Ordre', OrdreSchema);

export {
    Ligne,
    Budget,
    PlanHebdo,
    Ordre
}

