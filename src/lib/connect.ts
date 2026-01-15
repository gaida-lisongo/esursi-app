import mongoose from 'mongoose';
import '@/lib/models/index';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Veuillez définir la variable d’environnement MONGODB_URI dans .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const mongooseCache: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (process.env.NODE_ENV === 'development') {
    global.mongooseCache = mongooseCache;
}

async function dbConnect(): Promise<typeof mongoose> {
    if (mongooseCache.conn) {
        return mongooseCache.conn;
    }

    if (!mongooseCache.promise) {
        mongooseCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    mongooseCache.conn = await mongooseCache.promise;
    return mongooseCache.conn;
}

export default dbConnect;
