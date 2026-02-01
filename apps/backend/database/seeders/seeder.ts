import database from '../../app/core/database/database';
import { logErrors, logInfo } from '../../app/core/logging/helpers';
import UserSeeder from './UserSeeder';

async function main(): Promise<void> {
  const userSeeder = new UserSeeder();

  await database.$transaction([userSeeder.run()]);
}

logInfo('\nSeeding...\n');

main()
  .then(() => {
    logInfo('\nSeeding completed successfully!\n');
    process.exit(0);
  })
  .catch(async (error: Error) => {
    logErrors(`An error occurred while seeding the database:\n\n${error}`);
    process.exit(1);
  });
