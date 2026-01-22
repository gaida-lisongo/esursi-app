import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAffectation extends Document {
    agent: Schema.Types.ObjectId;
    etablissement: Schema.Types.ObjectId;
    annee: Schema.Types.ObjectId;
    actif: boolean;
}

const AffectationSchema = new Schema({
    agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    actif: { type: Boolean, default: true },
});

const Affectation: Model<IAffectation> = mongoose.models.Affectation || mongoose.model<IAffectation>('Affectation', AffectationSchema);

export default Affectation;