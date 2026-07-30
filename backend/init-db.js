import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'loyalty',
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL database:', process.env.DB_NAME || 'loyalty');

    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('⚡ Executing Database Schema Migration & Seeding...');
    await client.query(sql);

    const migrationPath = path.join(__dirname, 'migrations', '001_add_reward_category_and_sequences.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      console.log('⚡ Executing Migration: reward category & member sequences...');
      await client.query(migrationSql);
    }

    console.log('✅ Database initialization completed successfully!');
  } catch (err) {
    console.error('❌ Error executing database initialization:', err);
  } finally {
    await client.end();
  }
}

initDatabase();