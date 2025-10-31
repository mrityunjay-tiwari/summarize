"use server";
import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv';
dotenv.config();

export async function getDBConnection () {
    if(!process.env.DATABASE_URL) {
        throw new Error('neonDB url is not defined')
    }
    const sql = neon(process.env.DATABASE_URL);
    return sql;
}