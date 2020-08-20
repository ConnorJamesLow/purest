import { Route } from "../types"

const ping: Route = (_, res) => {
    res.send({ status: 'ok' });
}

export default ping;
