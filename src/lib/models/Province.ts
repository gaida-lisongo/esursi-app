import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProvince extends Document {
    designation: string;
    code: string;
    description?: string;
    actif: boolean;
}

const ProvinceSchema: Schema = new Schema({
    designation: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    actif: { type: Boolean, default: true },
});

const Province: Model<IProvince> = mongoose.models.Province || mongoose.model<IProvince>('Province', ProvinceSchema);

export default Province;