import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGrade extends Document {
    designation: string;
    code: string;
    personnel: 'PAS' | 'PATO';
}

const GradeSchema: Schema = new Schema({
    designation: { type: String, required: true },
    code: { type: String, required: true },
    personnel: { type: String, enum: ['PAS', 'PATO'], default: 'PAS' },
});

const Grade: Model<IGrade> = mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeSchema);

export default Grade;