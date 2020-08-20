import { Route } from "../types"

const log: Route = (req, _, next) => {
    const { url, method } = req;
    console.log(`Received ${method} request to '${url}'`);
    next && next();
}

export default log;
