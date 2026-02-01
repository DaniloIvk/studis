import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'database/schema',
  migrations: {
    path: 'database/migrations',
    seed: 'npx tsx database/seeders/seeder.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
