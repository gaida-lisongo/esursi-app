import mongoose, { Document, Model, Schema } from 'mongoose';

interface Admin extends Document {
    agentId: mongoose.Types.ObjectId;
    role: "Finance" | "Education" | "Moderateur" | "Super";
    password: string;
}

const AdminSchema = new Schema<Admin>({
    agentId: { type: mongoose.Types.ObjectId, ref: "Agent", required: true },
    role: { type: String, enum: ["Finance", "Education", "Moderateur", "Super"], default: "Moderateur", required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

const Admin: Model<Admin> = mongoose.models.Admin || mongoose.model<Admin>('Admin', AdminSchema);

export default Admin;
