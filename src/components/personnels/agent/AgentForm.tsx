"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import Spinner from "@/components/ui/Spinner";
import { uploadPhoto } from "@/lib/utils/photo";

interface AgentFormProps {
    agent?: any;
    grades: any[];
    provinces: any[];
    onClose: () => void;
    onSubmit: (formData: any) => Promise<any>;
}

export const AgentForm = ({ agent, grades, provinces, onClose, onSubmit }: AgentFormProps) => {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState(agent || {});
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);
    const { showNotification } = useNotification();
    const [loading, setLoading] = React.useState(false);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        let finalData = { ...formData };

        if (photoFile) {
            const photoFormData = new FormData();
            photoFormData.append("file", photoFile);
            const uploadRes = await uploadPhoto(photoFormData);
            if (uploadRes.success) {
                finalData.photo = uploadRes.url;
            } else {
                showNotification(uploadRes.error || "Erreur lors de l'upload de la photo", "error");
                setLoading(false);
                return;
            }
        }

        const res = await onSubmit(finalData);
        setLoading(false);
        if (res.success) {
            showNotification(res.message || "Opération réussie", "success");
            onClose();
        } else {
            showNotification(res.message || "Une erreur est survenue", "error");
        }
    }

    const renderSummary = () => {
        const grade = grades.find(g => g.id === formData.grade);
        const province = provinces.find(p => p.id === formData.province);

        return (
            <div className="space-y-4 text-sm">
                <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="font-bold text-base mb-2 border-b pb-2">Identité</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <p><strong>Nom:</strong> {formData.nom}</p>
                        <p><strong>Post-nom:</strong> {formData.postNom}</p>
                        <p><strong>Prénom:</strong> {formData.prenom}</p>
                        <p><strong>Sexe:</strong> {formData.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                        <p><strong>Né(e) le:</strong> {new Date(formData.dateNaissance).toLocaleDateString()}</p>
                        <p><strong>à:</strong> {formData.lieuNaissance}</p>
                        <p><strong>Nationalité:</strong> {formData.nationalite}</p>
                        <p><strong>Province:</strong> {province?.designation}</p>
                    </div>
                </div>
                <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="font-bold text-base mb-2 border-b pb-2">Contact & Position</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <p><strong>Téléphone:</strong> {formData.telephone}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Adresse:</strong> {formData.adresse}</p>
                        <p><strong>Grade:</strong> {grade?.designation}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                {agent ? "Modifier l'agent" : "Ajouter un agent"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Étape 1: Identité</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                                    <input name="nom" value={formData.nom || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Post-nom</label>
                                    <input name="postNom" value={formData.postNom || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Prénom</label>
                                    <input name="prenom" value={formData.prenom || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Sexe</label>
                                    <select name="sexe" value={formData.sexe || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Sélectionner...</option>
                                        <option value="M">Masculin</option>
                                        <option value="F">Féminin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date de Naissance</label>
                                    <input name="dateNaissance" type="date" value={formData.dateNaissance ? new Date(formData.dateNaissance).toISOString().split('T')[0] : ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Lieu de Naissance</label>
                                    <input name="lieuNaissance" value={formData.lieuNaissance || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nationalité</label>
                                    <input name="nationalite" value={formData.nationalite || 'Congolaise'} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Province d'origine</label>
                                <select name="province" value={formData.province?.id || formData.province || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                                    <option value="">Sélectionner une province</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.designation}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Étape 2: Contact</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                                    <input name="telephone" value={formData.telephone || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <input name="email" type="email" value={formData.email || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Adresse</label>
                                <input name="adresse" value={formData.adresse || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Grade</label>
                                    <select name="grade" value={formData.grade?.id || formData.grade || ''} onChange={handleChange} required className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Sélectionner un grade</option>
                                        {grades.map(g => <option key={g.id} value={g.id}>{g.designation} ({g.code})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Photo (Optionnel)</label>
                                    <input type="file" name="photo" onChange={handlePhotoChange} className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Étape 3: Résumé et Confirmation</h3>
                        {renderSummary()}
                    </div>
                )}
                <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        {step > 1 && (
                            <button type="button" onClick={handleBack} className="px-6 py-2 font-semibold text-gray-500 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                Précédent
                            </button>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-500 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            Annuler
                        </button>
                        {step < 3 && (
                            <button type="button" onClick={handleNext} className="px-6 py-2 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700">
                                Suivant
                            </button>
                        )}
                        {step === 3 && (
                            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                                {loading && <Spinner size="sm" />}
                                {agent ? "Mettre à jour" : "Créer l'agent"}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
