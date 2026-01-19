import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICycle extends Document {
    designation: string;
    code: string;
    description?: string;
    credits: number;
    actif: boolean;
    maquetteUrl?: string;
}

export interface IProgramme extends Document {
    designation: string;
    code: string;
    description?: string;
    cycle: Schema.Types.ObjectId;
    credits: number;
    actif: boolean;
}

export interface IDomaine extends Document {
    designation: string;
    code: string;
    description?: string;
    mentions: string[];
    maquetteUrl?: string;
    cycle: Schema.Types.ObjectId;
}

const CycleSchema: Schema = new Schema<ICycle>({
    designation: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    credits: { type: Number, required: true },
    actif: { type: Boolean, default: true },
    maquetteUrl: { type: String, required: false },
});

const ProgrammeSchema: Schema = new Schema<IProgramme>({
    designation: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    cycle: { type: Schema.Types.ObjectId, ref: 'Cycle', required: true },
    credits: { type: Number, required: true },
    actif: { type: Boolean, default: true },
});

const DomaineSchema: Schema = new Schema<IDomaine>({
    designation: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    mentions: { type: [String], required: true },
    maquetteUrl: { type: String, required: false },
    cycle: { type: Schema.Types.ObjectId, ref: 'Cycle', required: true },
});

const Cycle: Model<ICycle> = mongoose.models.Cycle || mongoose.model<ICycle>('Cycle', CycleSchema);
const Programme: Model<IProgramme> = mongoose.models.Programme || mongoose.model<IProgramme>('Programme', ProgrammeSchema);
const Domaine: Model<IDomaine> = mongoose.models.Domaine || mongoose.model<IDomaine>('Domaine', DomaineSchema);

export {
    Cycle,
    Programme,
    Domaine
}