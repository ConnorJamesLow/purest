import express from 'express';
import parser from 'body-parser';
import ping from './ping';
import log from './log';
import list from './list';
import { connect } from '../data';


export const createRouter = (handle: any) => {
    const app = express();
    app.use(parser.json());
    app.listen(handle, () => console.log(`Started listening on port ${handle}!`));

    return app;
}

export const startup = async (router: express.Express, url: string, dbName: string) => {
    const db = await connect(url, dbName);
    router.all('/_meta/ping', ping);
    router.all('/_meta/test', async (_, res) => {
        const record = { name: 'test record', date: new Date() };
        db.create('_meta', record);
        const result = await db.find('_meta', {});
        res.send(result);

        // Clean up
        result.forEach(r => db.delete('_meta', r._id));
        db.db.dropCollection('_meta');
    });
    router.get('/_meta/resources|collections', list(db.db));
    router.get('/_meta/*', (req, res) => {
        res.statusCode = 400;
        res.send(`${req.url} is not a valid meta path.`)
    })
    router.get('/:root*', (req, res) => {
        console.log('test:', req.params);
        res.send(req.params);
    })

    // Rest methods:
    router.all('*', log);
    router.get('/:collection-search', async (req, res) => {
        console.log('get /:collection/find');
        const { params: { collection }, query: rawQuery } = req;
        const query = tryParseAll(rawQuery);
        console.log('query:', query)
        res.send(await db.find(collection, query));
    });

    router.get('/:collection/:id', async (req, res) => {
        console.log('get /:collection/:id');
        const { params: { collection, id } } = req;
        res.send(await db.get(collection, id));
    });

    router.get('/:collection', async (req, res) => {
        console.log('get /:collection');
        const { params: { collection }, query } = req;
        res.send(await db.read(collection, query));
    });

    router.post('/:collection', async (req, res) => {
        console.log('post /:collection');
        const { body, params: { collection } } = req;
        res.send({ record: body, result: await db.create(collection, body) });
    });

    router.patch('/:collection/:id', async (req, res) => {
        console.log('patch /:collection/:id');
        const { body, params: { collection, id } } = req;
        res.send(await db.update(collection, id, body));
    });

    router.put('/:collection/:id', async (req, res) => {
        console.log('put /:collection/:id');
        const { body, params: { collection, id } } = req;
        res.send(await db.replace(collection, id, body));
    });

    router.delete('/:collection/:id', async (req, res) => {
        console.log('delete /:collection/:id');
        const { params: { collection, id } } = req;
        res.send(await db.delete(collection, id));
    });
}

const tryParseAll = (obj: any) => Object.keys(obj)
    .reduce((acc, k) => ({ ...acc, [k]: tryParseJSON(obj[k]) }), {});

const tryParseJSON = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return str;
    }
}
