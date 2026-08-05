import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'academy_system';

if (!uri) {
    throw new Error('MONGODB_URI is not set');
}

let cachedClient;
let cachedDb;

export async function getDb() {
    if (cachedDb) return cachedDb;

    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
        await cachedClient.connect();
    }

    cachedDb = cachedClient.db(dbName);
    return cachedDb;
}
