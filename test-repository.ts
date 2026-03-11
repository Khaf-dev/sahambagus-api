import { PrismaClient } from '@prisma/client';
import { NewsRepository } from './src/modules/news/infrastructure/repositories/news.repository';
import { AnalysisRepository } from './src/modules/analysis/infrastructure/repositories/analysis.repository';
import { PrismaService } from './src/shared/database/prisma.service';

async function test() {
  const prisma = new PrismaService();
  await prisma.$connect();

  console.log('Testing Repository Layer...\n');

  // Test News Repository
  const newsRepo = new NewsRepository(prisma);
  
  console.log('📰 Testing NewsRepository.findMany()...');
  const news = await newsRepo.findMany({});
  console.log(`Found ${news.length} news items`);
  news.forEach((n) => {
    console.log(`  - [${n.status.toString()}] ${n.title}`);
  });

  console.log('\n📰 Testing NewsRepository.count()...');
  const newsCount = await newsRepo.count({});
  console.log(`Count: ${newsCount}`);

  // Test Analysis Repository
  const analysisRepo = new AnalysisRepository(prisma);
  
  console.log('\n📊 Testing AnalysisRepository.findMany()...');
  const analysis = await analysisRepo.findMany({});
  console.log(`Found ${analysis.length} analysis items`);
  analysis.forEach((a) => {
    console.log(`  - [${a.status.toString()}] ${a.stockTicker.toString()} - ${a.title}`);
  });

  console.log('\n📊 Testing AnalysisRepository.count()...');
  const analysisCount = await analysisRepo.count({});
  console.log(`Count: ${analysisCount}`);

  await prisma.$disconnect();
}

test().catch(console.error);