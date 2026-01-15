import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IActivite extends Document {
    designation: string;
    description?: string[];
}

export interface IAnnee extends Document {
    debut: string;
    fin: string;
    description?: string;
    calendrier: [{
        titre: string;
        activites: Schema.Types.ObjectId[]
    }];
    actif: boolean;
}

const ActiviteSchema: Schema = new Schema<IActivite>({
    designation: { type: String, required: true },
    description: [{ type: String }],
});

const AnneeSchema: Schema = new Schema<IAnnee>({
    debut: { type: String, required: true },
    fin: { type: String, required: true },
    description: { type: String },
    calendrier: [{
        titre: { type: String, required: true },
        activites: [{ type: Schema.Types.ObjectId, ref: 'Activite', required: true }],
    }],
    actif: { type: Boolean, default: true },
});

const Annee: Model<IAnnee> = mongoose.models.Annee || mongoose.model<IAnnee>('Annee', AnneeSchema);
const Activite: Model<IActivite> = mongoose.models.Activite || mongoose.model<IActivite>('Activite', ActiviteSchema);
export {
    Annee,
    Activite
}