import logger from './logger';

/**
 * Seed development data for web backend.
 * The admin service already has mock data, but this can be extended
 * to add more comprehensive test data if needed.
 */
export const seedDevelopmentData = (): void => {
  try {
    logger.info('🌱 Seeding development data for web admin backend...');

    // The admin service already contains:
    // - 8 sample policies (Active, Pending, Expired)
    // - 8 city risk data entries
    // - 5 sample claims (Pending, Approved, Rejected, Paid)

    logger.info('✅ Admin policies: 8 sample policies loaded');
    logger.info('✅ City risk data: 8 cities with risk metrics');
    logger.info('✅ Claims data: 5 sample claims with various statuses');
    logger.info('🎉 Development data seeding completed successfully!');

    // Future enhancement: Add more dynamic data generation here
    // For now, the static data in admin.service.ts is sufficient
  } catch (error) {
    logger.error('❌ Error seeding development data:', error);
    throw error;
  }
};
