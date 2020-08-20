import { Route } from "../types"
import { Db } from "mongodb";

const list: (db: Db) => Route = (db: Db) => async (_, res) => {
    const raw = await db.listCollections({}, { nameOnly: true }).toArray();
    res.send(raw.map(i => i.name));
};

export default list;
