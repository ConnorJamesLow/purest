import { Db, ObjectId } from "mongodb";

/** Represents a type of resource. */
type Collection<T = string> = T extends '_meta' ? never : T;

/** The ObjectId of a resource. */
type Id = ObjectId | string;

export default (db: Db) => ({
    /**
     * Add one or more resources to the state. Maps to POST.
     * @param collection
     * @param docs Resources to insert.
     */
    async create(collection: Collection, docs: any) {
        const { result } = await db.collection(collection).insertOne(docs)
        return result;
    },

    /**
     * Get all records matching critera.
     * @param query The search criteria (must exactly match all).
     */
    read: (collection: Collection, query: any) => db.collection(collection)
        .find(query)
        .toArray(),

    /**
     * Modify specific values on a resource. Maps to PATCH.
     * @param data The content of the update.
     */
    async update(collection: Collection, id: Id, data: any) {
        const _id = typeof id === 'string' ? new ObjectId(id) : id;
        const { result } = await db.collection(collection)
            .updateOne({ _id }, data);
        return result;
    },

    /**
     * Delete a resource. Maps to DELETE.
     */
    async delete(collection: Collection, id: Id) {
        const _id = typeof id === 'string' ? new ObjectId(id) : id;
        const { result } = await db.collection(collection)
            .deleteOne({ _id });
        return result;
    },

    /**
     * Get one resource by it's object_id;
     */
    async get(collection: Collection, id: Id) {
        const _id = typeof id === 'string' ? new ObjectId(id) : id;
        const result = await db.collection(collection)
            .find({ _id })
            .limit(1)
            .toArray();
        return result.find(_ => true);
    },

    /**
     * Like `read()`, but converts string query parameters into regular expressions for a more "search-like" experience.
     */
    find: (collection: Collection, query: any) => db.collection(collection)
        .find({
            ...Object.keys(query).reduce((acc, i) => ({
                ...acc,
                [i]: typeof query[i] === 'string' ? new RegExp(query[i], 'i') : query[i]
            }), {})
        }, { maxTimeMS: 10000 })
        .toArray(),

    /**
     * Replace a resource with new values. Maps to PUT.
     * @param data The values to use in the replace.
     */
    async replace(collection: Collection, id: ObjectId | string, data: any) {
        const _id = typeof id === 'string' ? new ObjectId(id) : id;
        const { result } = await db.collection(collection)
            .replaceOne({ _id }, data);
        return result;
    }

})
