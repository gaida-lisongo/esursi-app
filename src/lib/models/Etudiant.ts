import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEtudiant extends Document {
    nom: string;
    postNom: string;
    prenom: string;
    dateNaissance: Date;
    lieuNaissance: string;
    nationalite: string;
    sexe: 'Masculin' | 'Feminin';
    adresse: string;
    telephone: string;
    email: string;
    grade: 'Diplomé' | 'Gradué' | 'Licencié' | 'Magistral' | 'Doctorat';
    photo?: string;
    matricule: string;
    action: boolean;
}

export interface IDossierEtudiant extends Document {
    etudiant: Schema.Types.ObjectId;
    scolarite: [{
        annee: string;
        document: string;
        date: string;
    }]
}

export interface IParcours extends Document {
    etudiant: Schema.Types.ObjectId;
    programme: Schema.Types.ObjectId;
    annee: Schema.Types.ObjectId;
    decision: 'Admis' | 'Non Admis' | 'En attente';
    document: string;
    date: string;
    etablissement: Schema.Types.ObjectId;
}

export interface IPaiement extends Document {
    etudiant: Schema.Types.ObjectId;
    montant: number;
    date: string;
    frais: Schema.Types.ObjectId;
    status: 'NO' | 'PENDING' | 'OK';
    orderNumber: string;
    tranche: string;
    description?: string[];
}

const EtudiantSchema: Schema = new Schema({
    nom: { type: String, required: true },
    postNom: { type: String, required: true },
    prenom: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    lieuNaissance: { type: String, required: true },
    nationalite: { type: String, required: true },
    sexe: { type: String, enum: ['Masculin', 'Feminin'], required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    grade: { type: String, enum: ['Diplomé', 'Gradué', 'Licencié', 'Magistral', 'Doctorat'], required: true },
    photo: { type: String },
    matricule: { type: String, required: true },
    action: { type: Boolean, default: true },
});

const DossierEtudiantSchema: Schema = new Schema({
    etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    scolarite: [{
        annee: { type: String, required: true },
        document: { type: String, required: true },
        date: { type: String, required: true },
    }]
});

const ParcoursSchema: Schema = new Schema({
    etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    programme: { type: Schema.Types.ObjectId, ref: 'Programme', required: true },
    annee: { type: Schema.Types.ObjectId, ref: 'Annee', required: true },
    decision: { type: String, enum: ['Admis', 'Non Admis', 'En attente'], required: true },
    document: { type: String, required: true },
    date: { type: String, required: true },
    etablissement: { type: Schema.Types.ObjectId, ref: 'Etablissement', required: true },
});

const PaiementSchema: Schema = new Schema({
    etudiant: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    montant: { type: Number, required: true },
    date: { type: String, required: true },
    frais: { type: Schema.Types.ObjectId, ref: 'Frais', required: true },
    status: { type: String, enum: ['NO', 'PENDING', 'OK'], default: 'PENDING' },
    orderNumber: { type: String, required: true },
    tranche: { type: String, required: true },
    description: [{ type: String }],
});

const Etudiant: Model<IEtudiant> = mongoose.models.Etudiant || mongoose.model<IEtudiant>('Etudiant', EtudiantSchema);
const DossierEtudiant: Model<IDossierEtudiant> = mongoose.models.DossierEtudiant || mongoose.model<IDossierEtudiant>('DossierEtudiant', DossierEtudiantSchema);
const Parcours: Model<IParcours> = mongoose.models.Parcours || mongoose.model<IParcours>('Parcours', ParcoursSchema);
const Paiement: Model<IPaiement> = mongoose.models.Paiement || mongoose.model<IPaiement>('Paiement', PaiementSchema);

export {
    Etudiant,
    DossierEtudiant,
    Parcours,
    Paiement
}
