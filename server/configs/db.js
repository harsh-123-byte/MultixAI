import {neon} from '@neondatabase/serverless'

const sql = neon(`${process.env.DATABASE_URL}`);

export default sql; // we can read or write the data on sql database.

// Table which we are creating on neon database contains these rows,to store the different types of data..

// create TABLE creations (
//     id SERIAL PRIMARY KEY,
//     user_id TEXT NOT NULL,
//     prompt TEXT NOT NULL,
//     content TEXT NOT NULL,
//     type TEXT NOT NULL,
//     publish BOOLEAN DEFAULT FALSE,
//     likes TEXT[] DEFAULT '{}',
//     created_at TIMESTAMPZ DEFAULT NOW(),
//     updated_at TIMESTAMPZ DEFAULT NOW(), 
// )