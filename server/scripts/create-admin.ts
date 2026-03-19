/**
 * Create an admin user. Run with:
 *   npx tsx server/scripts/create-admin.ts [username] [password] [displayName]
 *
 * Defaults: admin / vietjewelers2024 / Admin
 */
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'vietjewelers.db');

const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'vietjewelers2024';
const displayName = process.argv[4] || 'Admin';

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');

const hash = await bcrypt.hash(password, 12);

try {
  sqlite.prepare(`
    INSERT OR REPLACE INTO admin_users (username, password_hash, display_name)
    VALUES (?, ?, ?)
  `).run(username, hash, displayName);

  console.log(`✅ Admin user created/updated:`);
  console.log(`   Username: ${username}`);
  console.log(`   Display:  ${displayName}`);
  console.log(`   Password: ${password}`);
} catch (err) {
  console.error('Error creating admin user:', err);
} finally {
  sqlite.close();
}
