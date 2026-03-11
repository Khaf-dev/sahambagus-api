import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing direct Prisma queries...\n');

  // Test 1: Count all news
  const newsCount = await prisma.news.count();
  console.log(`Total news in DB: ${newsCount}`);

  // Test 2: Count non-deleted news
  const nonDeletedNews = await prisma.news.count({
    where: { deletedAt: null },
  });
  console.log(`Non-deleted news: ${nonDeletedNews}`);

  // Test 3: Get all news
  const allNews = await prisma.news.findMany({
    where: { deletedAt: null },
    take: 10,
  });
  console.log(`\nNews items found: ${allNews.length}`);
  allNews.forEach((n) => {
    console.log(`  - [${n.status}] ${n.title}`);
    console.log(`    deletedAt: ${n.deletedAt}`);
  });

  // Test 4: Count all analysis
  const analysisCount = await prisma.analysis.count();
  console.log(`\nTotal analysis in DB: ${analysisCount}`);

  // Test 5: Count non-deleted analysis
  const nonDeletedAnalysis = await prisma.analysis.count({
    where: { deletedAt: null },
  });
  console.log(`Non-deleted analysis: ${nonDeletedAnalysis}`);

  // Test 6: Get all analysis
  const allAnalysis = await prisma.analysis.findMany({
    where: { deletedAt: null },
    take: 10,
  });
  console.log(`\nAnalysis items found: ${allAnalysis.length}`);
  allAnalysis.forEach((a) => {
    console.log(`  - [${a.status}] ${a.stockTicker} - ${a.title}`);
    console.log(`    deletedAt: ${a.deletedAt}`);
  });

  await prisma.$disconnect();
}

test();