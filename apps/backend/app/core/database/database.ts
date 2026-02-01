import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import databaseConfig from '../../../config/database';
import { PrismaClient } from '../../../database/prisma/client';

export type WhereQuery = {
  where: Record<string, any>;
};

export type ExistsDelegate = {
  findFirst(where?: WhereQuery): Promise<object>;
};

// const adapter = new PrismaMariaDb(databaseConfig.url);
const adapter = new PrismaBetterSqlite3({ url: databaseConfig.url });
const database = new PrismaClient({ adapter });

export default database;
