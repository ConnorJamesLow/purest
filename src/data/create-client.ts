import { MongoClient, MongoClientOptions } from 'mongodb';

export default (url: string, options?: MongoClientOptions) => new Promise<MongoClient>(resolve => {
    MongoClient.connect(url, options ?? {}, (error, client) => {
        if (error) {
            throw error;
        }
        resolve(client);
    })
});