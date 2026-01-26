// Test de la fonctionnalité de gestion des pièces justificatives

/**
 * GESTION DES PIÈCES JUSTIFICATIVES
 * 
 * Cette fonctionnalité permet de gérer les pièces justificatives associées à chaque décaissement.
 * 
 * UTILISATION :
 * 1. Dans DecaissementCard, cliquer sur le bouton "Justifs (X)" 
 * 2. Une modal s'ouvre permettant de :
 *    - Visualiser les pièces existantes
 *    - Ajouter de nouvelles pièces (glisser-déposer ou cliquer)
 *    - Télécharger les pièces
 *    - Supprimer des pièces
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Upload via Cloudinary (voir src/lib/utils/photo.ts)
 * - Stockage des URLs dans MongoDB (champ pieces du PlanHebdo)
 * - Interface responsive avec preview des images
 * 
 * API ENDPOINTS :
 * - PUT /api/depenses/plan-hebdo/[id]/pieces - Mise à jour des pièces
 * 
 * CONTRAINTES :
 * - Formats acceptés : JPG, PNG, GIF, WebP  
 * - Taille max : 5MB par fichier
 * - Stockage : Cloudinary (dossier "esursi")
 * 
 * FLUX DE DONNÉES :
 * 1. Sélection fichier → Upload Cloudinary → URL retournée
 * 2. Sauvegarde URL dans MongoDB → Refresh UI
 * 3. Suppression → Retrait URL de MongoDB → Refresh UI
 */

export const PIECES_JUSTIFICATIVES_INFO = {
    supportedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    cloudinaryFolder: 'esursi',
    uploadPreset: 'ml_default'
};

export default PIECES_JUSTIFICATIVES_INFO;