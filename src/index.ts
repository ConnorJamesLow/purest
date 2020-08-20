import { createRouter, startup } from './router';
import { PORT, DB_NAME, URL } from './config';


const router = createRouter(PORT);
startup(router, URL, DB_NAME);
