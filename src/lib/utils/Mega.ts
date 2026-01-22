import { Storage } from 'megajs';
import fs from 'fs';
import path from 'path';

// Interface pour le service
interface IMegaService {
    connect(): Promise<Storage>;
    upload(filePath: string): Promise<any>;
    getLink(file: any): Promise<string>;
}

class MegaService implements IMegaService {
    private static instance: MegaService | null = null;
    private storage: any = null;
    private isConnected: boolean = false;

    constructor() {
        // Le Singleton : on vérifie si l'instance existe déjà
        if (MegaService.instance) {
            return MegaService.instance;
        }

        // Utiliser defineProperty pour des propriétés modifiables même après freeze
        Object.defineProperty(this, 'storage', {
            value: null,
            writable: true,
            configurable: true
        });
        Object.defineProperty(this, 'isConnected', {
            value: false,
            writable: true,
            configurable: true
        });

        // On sauvegarde l'instance
        MegaService.instance = this;
    }

    /**
     * Initialise la connexion unique
     */
    async connect(): Promise<Storage> {
        return new Promise((resolve, reject) => {
            if (this.isConnected && this.storage) {
                return resolve(this.storage);
            }

            this.storage = new Storage({
                email: process.env.MEGA_EMAIL,
                password: process.env.MEGA_PASSWORD,
            }, (err: Error) => {
                if (err) return reject(err);
                this.isConnected = true;
                console.log("☁️  MegaService : Nouvelle connexion établie (Singleton)");
                resolve(this.storage);
            });
        });
    }

    parseFile(filePath: string) {
        if (!fs.existsSync(filePath)) throw new Error("Fichier local introuvable");

        return {
            name: path.basename(filePath),
            size: fs.statSync(filePath).size,
            stream: fs.createReadStream(filePath)
        };
    }

    async upload(filePath: string): Promise<any> {
        await this.connect();
        const { name, size, stream } = this.parseFile(filePath);

        return new Promise((resolve, reject) => {
            this.storage.upload({ name, size }, stream, (err: Error, file: any) => {
                if (err) return reject(err);
                resolve(file);
            });
        });
    }

    async getLink(file: any): Promise<string> {
        try {
            return await file.link();
        } catch (error: any) {
            throw new Error("Erreur de génération du lien : " + error.message);
        }
    }
}

// Créer l'instance singleton sans la geler
const instance = new MegaService();

export default instance;