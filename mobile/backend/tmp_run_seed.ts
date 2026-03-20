import { seedDevelopmentData } from './src/utils/seedData';

seedDevelopmentData()
  .then(() => {
    console.log('Seeding finished successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
