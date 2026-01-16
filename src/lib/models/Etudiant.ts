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
    status: 'PENDING' | 'OK' | 'NO';
    scolarite: [{
        annee: string;
        document: string;
        date: string;
        status: 'PENDING' | 'OK' | 'NO';
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
    tranches: Schema.Types.ObjectId[];
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
    status: { type: String, enum: ['PENDING', 'OK', 'NO'], default: 'PENDING' },
    scolarite: [{
        annee: { type: String, required: true },
        document: { type: String, required: true },
        date: { type: String, required: true },
        status: { type: String, enum: ['PENDING', 'OK', 'NO'], default: 'PENDING' }
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

const Etudiant: Model<IEtudiant> = mongoose.models.Etudiant || mongoose.model<IEtudiant>('Etudiant', EtudiantSchema);
const DossierEtudiant: Model<IDossierEtudiant> = mongoose.models.DossierEtudiant || mongoose.model<IDossierEtudiant>('DossierEtudiant', DossierEtudiantSchema);
const Parcours: Model<IParcours> = mongoose.models.Parcours || mongoose.model<IParcours>('Parcours', ParcoursSchema);

export {
    Etudiant,
    DossierEtudiant,
    Parcours
}
