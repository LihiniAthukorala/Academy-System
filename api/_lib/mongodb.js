import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import { randomUUID } from 'node:crypto';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'academy_system';

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data');

let cachedClient;
let cachedDb;
let localDb;

const ensureDataDir = async () => {
    await fs.mkdir(dataDir, { recursive: true });
};

const collectionFilePath = (collectionName) => path.join(dataDir, `${collectionName}.json`);

const readCollectionFile = async (collectionName) => {
    try {
        const fileContents = await fs.readFile(collectionFilePath(collectionName), 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeCollectionFile = async (collectionName, documents) => {
    await ensureDataDir();
    await fs.writeFile(collectionFilePath(collectionName), JSON.stringify(documents, null, 2), 'utf8');
};

const createLocalCollection = (collectionName) => ({
    async find(filter = {}) {
        const items = await readCollectionFile(collectionName);
        const results = Object.keys(filter).length
            ? items.filter((item) =>
                  Object.entries(filter).every(([key, value]) => item[key] === value)
              )
            : items;

        return {
            sort(sortObj) {
                const sorted = [...results];
                const [[field, direction]] = Object.entries(sortObj);
                sorted.sort((a, b) => {
                    const av = a[field];
                    const bv = b[field];

                    if (av === bv) return 0;
                    if (av === undefined || av === null) return 1;
                    if (bv === undefined || bv === null) return -1;
                    return (av > bv ? 1 : -1) * (direction === -1 ? -1 : 1);
                });
                return {
                    toArray: async () => sorted
                };
            },
            async toArray() {
                return results;
            }
        };
    },
    async deleteMany(filter = {}) {
        const items = await readCollectionFile(collectionName);
        if (!filter || Object.keys(filter).length === 0) {
            await writeCollectionFile(collectionName, []);
            return { deletedCount: items.length };
        }

        const remaining = items.filter(
            (item) => !Object.entries(filter).every(([key, value]) => item[key] === value)
        );
        await writeCollectionFile(collectionName, remaining);
        return { deletedCount: items.length - remaining.length };
    },
    async insertOne(document) {
        const items = await readCollectionFile(collectionName);
        const newDocument = {
            ...document,
            _id: document._id || randomUUID()
        };
        items.push(newDocument);
        await writeCollectionFile(collectionName, items);
        return { insertedId: newDocument._id };
    },
    async insertMany(documents) {
        const items = await readCollectionFile(collectionName);
        const docsWithIds = documents.map((document) => ({
            ...document,
            _id: document._id || randomUUID()
        }));
        await writeCollectionFile(collectionName, [...items, ...docsWithIds]);
        return { insertedCount: docsWithIds.length };
    }
});

const createLocalDb = () => ({
    databaseName: dbName,
    command: async (command) => {
        if (command && command.ping === 1) {
            return { ok: 1 };
        }
        return { ok: 1 };
    },
    collection: (collectionName) => createLocalCollection(collectionName)
});

export async function getDb() {
    if (uri) {
        if (cachedDb) return cachedDb;

        if (!cachedClient) {
            cachedClient = new MongoClient(uri);
            await cachedClient.connect();
        }

        cachedDb = cachedClient.db(dbName);
        return cachedDb;
    }

    if (!localDb) {
        localDb = createLocalDb();
    }

    return localDb;
}
