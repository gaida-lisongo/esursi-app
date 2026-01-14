import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMarchand extends Document {
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    dateCreation: Date;
    actif: boolean;
}

export interface IDocument extends Document {
    type: string;
    reference: string;
    url?: string
}

const MarchandSchema: Schema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    adresse: { type: String },
    dateCreation: { type: Date, default: Date.now },
    actif: { type: Boolean, default: true },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }]
});

const Marchand: Model<IMarchand> = mongoose.models.Marchand || mongoose.model<IMarchand>('Marchand', MarchandSchema);

export default Marchand;
