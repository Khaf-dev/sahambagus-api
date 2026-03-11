/**
 * Prisma Seed Entry Point
 * 
 * Usage :
 * - Development: npm run seed:dev
 * - Production: npm run seed:prod
 */

const seedType = process.argv[2] || 'dev';

async function runSeed() {
    if (seedType === 'prod' || seedType === 'production') {
        await import('./seeds/prod.seed');
    } else {
        console.log('Running DEVELOPMENT seed...\n');
        await import('./seeds/dev.seed');
    }
}

runSeed().catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
});