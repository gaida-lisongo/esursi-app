"use client";

import { useState } from "react";
import { CloseIcon, PlusIcon, DownloadIcon, TrashBinIcon } from "@/icons";
import { uploadPhoto } from "@/lib/utils/photo";
import Image from "next/image";

interface PiecesModalProps {
    pieces: string[];
    title: string;
    planId: string;
    onClose: () => void;
    onUpdate?: () => void;
}

const PiecesModal = ({ pieces, title, planId, onClose, onUpdate }: PiecesModalProps) => {
    const [localPieces, setLocalPieces] = useState<string[]>(pieces || []);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Vérifier le type de fichier (images seulement)
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert("Veuillez sélectionner une image (JPEG, PNG, GIF, WebP)");
            return;
        }

        // Vérifier la taille (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("L'image ne doit pas dépasser 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const uploadResult = await uploadPhoto(formData);
            
            if (uploadResult.success && uploadResult.url) {
                // Ajouter la nouvelle pièce à la liste locale
                const newPieces = [...localPieces, uploadResult.url];
                setLocalPieces(newPieces);
                
                // Sauvegarder sur le serveur
                await savePiecesToServer(newPieces);
            } else {
                alert("Erreur lors de l'upload : " + uploadResult.error);
            }
        } catch (error) {
            console.error("Erreur d'upload:", error);
            alert("Erreur lors de l'upload de la photo");
        } finally {
            setIsUploading(false);
            // Reset l'input file
            event.target.value = "";
        }
    };

    const handleDeletePiece = async (pieceUrl: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette pièce justificative ?")) {
            return;
        }

        setIsDeleting(pieceUrl);
        try {
            const newPieces = localPieces.filter(p => p !== pieceUrl);
            setLocalPieces(newPieces);
            await savePiecesToServer(newPieces);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression");
        } finally {
            setIsDeleting(null);
        }
    };

    const savePiecesToServer = async (newPieces: string[]) => {
        try {
            const response = await fetch(`/api/depenses/plan-hebdo/${planId}/pieces`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pieces: newPieces }),
            });

            const result = await response.json();
            if (result.success && onUpdate) {
                onUpdate();
            } else if (!result.success) {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            throw error;
        }
    };

    const downloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Erreur lors du téléchargement:", error);
            alert("Erreur lors du téléchargement");
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            Pièces Justificatives
                        </h3>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                            {title}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
                            {isUploading ? (
                                <>
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    Upload...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-3 h-3" />
                                    Ajouter
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-red hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 font-bold"
                        >
                            X
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {localPieces.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {localPieces.map((pieceUrl, index) => (
                                <div key={index} className="relative group bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-200 transition-all">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={pieceUrl}
                                            alt={`Pièce justificative ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                                        
                                        {/* Actions overlay */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => downloadImage(pieceUrl, `piece_justificative_${index + 1}.jpg`)}
                                                className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                                                title="Télécharger"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePiece(pieceUrl)}
                                                disabled={isDeleting === pieceUrl}
                                                className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                {isDeleting === pieceUrl ? (
                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <TrashBinIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Image info */}
                                    <div className="p-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
                                            Pièce #{index + 1}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PlusIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune pièce justificative
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Ajoutez des photos des reçus, factures ou autres documents justificatifs
                            </p>
                            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors">
                                <PlusIcon className="w-5 h-5" />
                                Ajouter une pièce
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs shrink-0">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">
                        Total: {localPieces.length} pièce{localPieces.length !== 1 ? 's' : ''}
                    </span>
                    <div className="text-gray-500 text-[10px] space-y-1">
                        <div>Formats acceptés: JPG, PNG, GIF, WebP</div>
                        <div>Taille max: 5MB par fichier</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PiecesModal;