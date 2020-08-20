import dotenv from 'dotenv';
dotenv.config();

export const PRODUCTION = process.env.NODE_ENV === 'production';

/** The port on which the HTTP REST service will run. */
export const PORT = process.env.PORT || 3000;

/** The database connection string. */
export const URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';

/** The name of the database. */
export const DB_NAME = process.env.DB || 'restful';
