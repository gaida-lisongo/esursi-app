import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IArticle extends Document {
    photo: string;
    titre: string;
    sousTitre: string;
    description: string;
    contenu: string;
    annexes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const articleSchema: Schema<IArticle> = new Schema(
    {
        photo: { type: String },
        titre: { type: String, required: true },
        sousTitre: { type: String, required: true },
        description: { type: String, required: true },
        contenu: { type: String, required: true },
        annexes: { type: [String] },
    },
    { timestamps: true }
);

export default mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);
