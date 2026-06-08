import type * as SQLite from 'expo-sqlite';

import type { Migration } from '@/database/migrations/types';

const SCHEMA_MIGRATIONS_SQL = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL
  );
`;

export async function runMigrations(
  db: SQLite.SQLiteDatabase,
  migrations: readonly Migration[],
): Promise<void> {
  await db.execAsync(SCHEMA_MIGRATIONS_SQL);

  const appliedRows = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations',
  );
  const appliedVersions = new Set(appliedRows.map((row) => row.version));

  const pending = [...migrations]
    .filter((migration) => !appliedVersions.has(migration.version))
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.withExclusiveTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        migration.version,
        new Date().toISOString(),
      );
    });
  }
}
