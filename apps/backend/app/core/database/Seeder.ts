import { Prisma } from '../../../database/prisma/client';
import database from './database';

abstract class Seeder {
  protected readonly database: typeof database;

  constructor() {
    this.database = database;
  }

  /**
   * Run the seeder.
   */
  public abstract run(): Prisma.BatchPayload | Prisma.Payload<any>;
}

export default Seeder;
