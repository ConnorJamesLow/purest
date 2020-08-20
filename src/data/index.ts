import createClient from './create-client';
import methods from './CRUD';

export async function connect(url: string, dbName: string) {
    const client = await createClient(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const { create, read, update, get, delete: $delete, find, replace } = methods(db);
    return {
        db,
        close: () => client.close(),
        create,
        read,
        get,
        update,
        delete: $delete,
        find,
        replace
    }
}

