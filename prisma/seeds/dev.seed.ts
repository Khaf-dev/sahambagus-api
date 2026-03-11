import { PrismaClient, UserRole, ContentStatus, AnalysisType, MarketSentiment } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting development seed...\n');

    // Safety check
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Cannot run development seed in production environment');
    }

    // Clear existing data (dev only!)
  console.log('🗑️  Clearing existing data...');
  await prisma.analysisTag.deleteMany();
  await prisma.newsTag.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.news.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!@#', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@sahambagus.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const editor = await prisma.user.create({
    data: {
      email: 'editor@sahambagus.com',
      password: hashedPassword,
      firstName: 'Chief',
      lastName: 'Editor',
      role: UserRole.EDITOR,
      isActive: true,
    },
  });

  const author = await prisma.user.create({
    data: {
      email: 'author@sahambagus.com',
      password: hashedPassword,
      firstName: 'Content',
      lastName: 'Writer',
      role: UserRole.AUTHOR,
      isActive: true,
    },
  });

  console.log('✅ Created 3 users (admin, editor, author)\n');

  // Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Saham',
        slug: 'saham',
        description: 'Berita dan analisis saham Indonesia',
        color: '#3b82f6',
        icon: '📊',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Berita dan analisis crypto',
        color: '#f59e0b',
        icon: '₿',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Forex',
        slug: 'forex',
        description: 'Analisis pasar forex dan mata uang',
        color: '#10b981',
        icon: '💱',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Komoditas',
        slug: 'komoditas',
        description: 'Berita komoditas dan sumber daya',
        color: '#8b5cf6',
        icon: '🌾',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ekonomi Makro',
        slug: 'ekonomi-makro',
        description: 'Analisis ekonomi dan kebijakan',
        color: '#ec4899',
        icon: '🏛️',
      },
    }),
  ]);

  console.log('✅ Created 5 categories\n');

  // Create Tags
  console.log('🏷️  Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'BBRI', slug: 'bbri' } }),
    prisma.tag.create({ data: { name: 'BBCA', slug: 'bbca' } }),
    prisma.tag.create({ data: { name: 'TLKM', slug: 'tlkm' } }),
    prisma.tag.create({ data: { name: 'ASII', slug: 'asii' } }),
    prisma.tag.create({ data: { name: 'UNVR', slug: 'unvr' } }),
    prisma.tag.create({ data: { name: 'Banking', slug: 'banking' } }),
    prisma.tag.create({ data: { name: 'Technology', slug: 'technology' } }),
    prisma.tag.create({ data: { name: 'Consumer Goods', slug: 'consumer-goods' } }),
    prisma.tag.create({ data: { name: 'Bullish', slug: 'bullish' } }),
    prisma.tag.create({ data: { name: 'Bearish', slug: 'bearish' } }),
    prisma.tag.create({ data: { name: 'Breakout', slug: 'breakout' } }),
    prisma.tag.create({ data: { name: 'Support', slug: 'support' } }),
    prisma.tag.create({ data: { name: 'Resistance', slug: 'resistance' } }),
    prisma.tag.create({ data: { name: 'IHSG', slug: 'ihsg' } }),
    prisma.tag.create({ data: { name: 'Dividend', slug: 'dividend' } }),
    prisma.tag.create({ data: { name: 'IPO', slug: 'ipo' } }),
    prisma.tag.create({ data: { name: 'Quarterly Report', slug: 'quarterly-report' } }),
    prisma.tag.create({ data: { name: 'Blue Chip', slug: 'blue-chip' } }),
    prisma.tag.create({ data: { name: 'Market Update', slug: 'market-update' } }),
    prisma.tag.create({ data: { name: 'Technical Analysis', slug: 'technical-analysis' } }),
  ]);

  console.log('✅ Created 20 tags\n');

  // Create News Articles
  console.log('📰 Creating news articles...');
  
  const news1 = await prisma.news.create({
    data: {
      slug: 'ihsg-menguat-158-persen-ditopang-saham-perbankan',
      title: 'IHSG Menguat 1,58% Ditopang Saham Perbankan',
      subtitle: 'Sektor finansial memimpin penguatan bursa saham Indonesia',
      content: 'Jakarta - Indeks Harga Saham Gabungan (IHSG) ditutup menguat 1,58% ke level 7.285 pada perdagangan hari ini. Penguatan dipimpin oleh sektor perbankan yang naik rata-rata 2,3%. Saham PT Bank Rakyat Indonesia (BBRI) menjadi kontributor terbesar dengan kenaikan 3,2% ke Rp5.350. Sementara itu, PT Bank Central Asia (BBCA) naik 2,1% ke Rp9.875. Analis menilai penguatan ini didorong oleh sentimen positif kenaikan suku bunga acuan yang menguntungkan margin bank. Volume transaksi tercatat 15,2 miliar saham senilai Rp11,3 triliun.',
      excerpt: 'IHSG ditutup menguat 1,58% ke level 7.285 ditopang kinerja solid sektor perbankan',
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      categoryId: categories[0].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 1250,
      featuredImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/stock-market.jpg',
      featuredImageAlt: 'Grafik IHSG menunjukkan tren kenaikan',
      metaTitle: 'IHSG Menguat 1,58% Ditopang Saham Perbankan',
      metaDescription: 'IHSG ditutup menguat 1,58% ke level 7.285 ditopang kinerja solid sektor perbankan',
    },
  });

  await prisma.newsTag.createMany({
    data: [
      { newsId: news1.id, tagId: tags[13].id }, // IHSG
      { newsId: news1.id, tagId: tags[5].id },  // Banking
      { newsId: news1.id, tagId: tags[0].id },  // BBRI
      { newsId: news1.id, tagId: tags[1].id },  // BBCA
    ],
  });

  const news2 = await prisma.news.create({
    data: {
      slug: 'telkom-luncurkan-layanan-5g-di-10-kota-besar',
      title: 'Telkom Luncurkan Layanan 5G di 10 Kota Besar',
      subtitle: 'Ekspansi infrastruktur digital untuk mendukung transformasi ekonomi',
      content: 'Jakarta - PT Telkom Indonesia (TLKM) resmi meluncurkan layanan jaringan 5G di 10 kota besar Indonesia. Direktur Utama Telkom menyatakan investasi sebesar Rp15 triliun dialokasikan untuk pengembangan infrastruktur ini. Kota-kota yang mendapat layanan 5G antara lain Jakarta, Surabaya, Bandung, Medan, dan Makassar. Kecepatan internet yang ditawarkan mencapai 1 Gbps, 10 kali lebih cepat dari 4G. Analis memproyeksikan pendapatan Telkom akan meningkat 15% tahun depan berkat layanan premium ini.',
      excerpt: 'Telkom investasi Rp15 triliun untuk layanan 5G di 10 kota besar Indonesia',
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      categoryId: categories[0].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 890,
      featuredImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/5g-network.jpg',
      featuredImageAlt: 'Teknologi 5G Telkom Indonesia',
    },
  });

  await prisma.newsTag.createMany({
    data: [
      { newsId: news2.id, tagId: tags[2].id },  // TLKM
      { newsId: news2.id, tagId: tags[6].id },  // Technology
    ],
  });

  const news3 = await prisma.news.create({
    data: {
      slug: 'bi-pertahankan-suku-bunga-acuan-di-level-6-persen',
      title: 'BI Pertahankan Suku Bunga Acuan di Level 6%',
      content: 'Jakarta - Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan BI Rate di level 6,00%. Keputusan ini diambil dalam Rapat Dewan Gubernur dengan mempertimbangkan prospek inflasi yang terkendali dan pertumbuhan ekonomi yang solid di kisaran 5,2%. Gubernur BI menyatakan stance kebijakan moneter masih akomodatif untuk mendukung pertumbuhan ekonomi sambil menjaga stabilitas nilai tukar rupiah. Pasar uang dan saham merespon positif keputusan ini.',
      excerpt: 'Bank Indonesia pertahankan BI Rate 6% sambil menjaga stabilitas ekonomi',
      status: ContentStatus.PUBLISHED,
      categoryId: categories[4].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 650,
    },
  });

  await prisma.newsTag.createMany({
    data: [
      { newsId: news3.id, tagId: tags[13].id }, // IHSG
    ],
  });

  // Draft news
  await prisma.news.create({
    data: {
      slug: 'unilever-rilis-produk-ramah-lingkungan-terbaru',
      title: 'Unilever Rilis Produk Ramah Lingkungan Terbaru',
      content: 'Jakarta - PT Unilever Indonesia (UNVR) meluncurkan lini produk ramah lingkungan dengan kemasan 100% dapat didaur ulang. Draft content untuk review editor.',
      excerpt: 'Unilever fokus pada sustainability dengan produk eco-friendly',
      status: ContentStatus.DRAFT,
      categoryId: categories[0].id,
      authorId: author.id,
    },
  });

  console.log('✅ Created 4 news articles\n');

  // Create Stock Analysis
  console.log('📊 Creating stock analysis...');

  const analysis1 = await prisma.analysis.create({
    data: {
      slug: 'analisis-teknikal-bbri-breakout-resistance-5200',
      title: 'Analisis Teknikal BBRI: Breakout Resistance Rp5.200',
      subtitle: 'Potensi lanjutan rally menuju Rp5.800',
      content: 'PT Bank Rakyat Indonesia (BBRI) menunjukkan pola teknikal yang sangat menarik. Setelah konsolidasi 3 minggu di range Rp5.000-5.200, BBRI berhasil breakout dengan volume besar 450 juta lembar. Indikator teknikal menunjukkan sinyal bullish: RSI di 65 (momentum kuat), MACD golden cross, dan MA20/50 mendukung tren naik. Support kuat di Rp5.100, resistance berikutnya di Rp5.500 dan Rp5.800. Rekomendasi: BUY dengan target Rp5.500-5.800, cut loss di bawah Rp5.050.',
      excerpt: 'BBRI breakout resistance Rp5.200 dengan volume besar, target Rp5.500-5.800',
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      stockTicker: 'BBRI',
      analysisType: AnalysisType.TECHNICAL,
      marketSentiment: MarketSentiment.BULLISH,
      targetPrice: 5800,
      categoryId: categories[0].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 2340,
      featuredImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/bbri-chart.jpg',
      featuredImageAlt: 'Chart teknikal BBRI menunjukkan breakout pattern',
    },
  });

  await prisma.analysisTag.createMany({
    data: [
      { analysisId: analysis1.id, tagId: tags[0].id },  // BBRI
      { analysisId: analysis1.id, tagId: tags[8].id },  // Bullish
      { analysisId: analysis1.id, tagId: tags[10].id }, // Breakout
      { analysisId: analysis1.id, tagId: tags[19].id }, // Technical Analysis
    ],
  });

  const analysis2 = await prisma.analysis.create({
    data: {
      slug: 'fundamental-bbca-valuasi-menarik-pb-4x',
      title: 'Fundamental BBCA: Valuasi Menarik di PB 4x',
      content: 'PT Bank Central Asia (BBCA) saat ini trading di PB 4,2x, turun dari rata-rata historis 5x. Dengan ROE konsisten di atas 18%, NPL rendah 0,8%, dan pertumbuhan kredit 12% YoY, valuasi current sangat menarik untuk akumulasi jangka panjang. Proyeksi EPS 2024: Rp950, memberikan target price Rp11.500 (PB 5x). Dividend yield attractive di 2,1%.',
      excerpt: 'BBCA trading di PB 4,2x, valuasi menarik dengan fundamental solid',
      status: ContentStatus.PUBLISHED,
      stockTicker: 'BBCA',
      analysisType: AnalysisType.FUNDAMENTAL,
      marketSentiment: MarketSentiment.BULLISH,
      targetPrice: 11500,
      categoryId: categories[0].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 1820,
    },
  });

  await prisma.analysisTag.createMany({
    data: [
      { analysisId: analysis2.id, tagId: tags[1].id },  // BBCA
      { analysisId: analysis2.id, tagId: tags[5].id },  // Banking
      { analysisId: analysis2.id, tagId: tags[17].id }, // Blue Chip
    ],
  });

  const analysis3 = await prisma.analysis.create({
    data: {
      slug: 'market-update-tlkm-koreksi-sehat-area-support',
      title: 'Market Update TLKM: Koreksi Sehat di Area Support',
      content: 'TLKM mengalami koreksi 5% dalam 2 minggu terakhir, saat ini berada di area support kuat Rp3.900. Secara fundamental tidak ada perubahan, koreksi ini wajar setelah rally 25% dalam 3 bulan. Volume jual menurun, indikasi profit taking mulai mereda. Perhatikan area Rp3.850-3.900 sebagai zona akumulasi dengan risk/reward ratio menarik.',
      excerpt: 'TLKM koreksi sehat ke support Rp3.900, peluang akumulasi',
      status: ContentStatus.PUBLISHED,
      stockTicker: 'TLKM',
      analysisType: AnalysisType.MARKET_UPDATE,
      marketSentiment: MarketSentiment.NEUTRAL,
      targetPrice: 4200,
      categoryId: categories[0].id,
      authorId: editor.id,
      publishedAt: new Date(),
      viewCount: 980,
    },
  });

  await prisma.analysisTag.createMany({
    data: [
      { analysisId: analysis3.id, tagId: tags[2].id },  // TLKM
      { analysisId: analysis3.id, tagId: tags[11].id }, // Support
      { analysisId: analysis3.id, tagId: tags[18].id }, // Market Update
    ],
  });

  const analysis4 = await prisma.analysis.create({
    data: {
      slug: 'sentiment-analysis-asii-tekanan-jual-berlanjut',
      title: 'Sentiment Analysis ASII: Tekanan Jual Berlanjut',
      content: 'PT Astra International (ASII) masih dalam tekanan dengan sentimen bearish dominan. Penjualan otomotif yang lemah dan outlook suku bunga tinggi membebani kinerja. Secara teknikal, breakdown support Rp5.000 membuka ruang koreksi lebih dalam ke Rp4.700. Rekomendasi: WAIT, hindari dulu hingga muncul sinyal reversal.',
      excerpt: 'ASII dalam tekanan bearish, tunggu sinyal reversal',
      status: ContentStatus.PUBLISHED,
      stockTicker: 'ASII',
      analysisType: AnalysisType.SENTIMENT,
      marketSentiment: MarketSentiment.BEARISH,
      targetPrice: 4700,
      categoryId: categories[0].id,
      authorId: author.id,
      editorId: editor.id,
      publishedAt: new Date(),
      viewCount: 750,
    },
  });

  await prisma.analysisTag.createMany({
    data: [
      { analysisId: analysis4.id, tagId: tags[3].id },  // ASII
      { analysisId: analysis4.id, tagId: tags[9].id },  // Bearish
    ],
  });

  // Draft analysis
  await prisma.analysis.create({
    data: {
      slug: 'unvr-quarterly-report-analysis-q4-2024',
      title: 'UNVR Quarterly Report Analysis Q4 2024',
      content: 'Draft analisis laporan keuangan UNVR Q4 2024. Menunggu data lengkap untuk finalisasi.',
      excerpt: 'Analisis kinerja keuangan UNVR Q4 2024',
      status: ContentStatus.DRAFT,
      stockTicker: 'UNVR',
      analysisType: AnalysisType.FUNDAMENTAL,
      marketSentiment: MarketSentiment.NEUTRAL,
      categoryId: categories[0].id,
      authorId: author.id,
    },
  });

  console.log('✅ Created 5 stock analysis\n');

  console.log('🎉 Development seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('   - 3 Users (admin, editor, author)');
  console.log('   - 5 Categories');
  console.log('   - 20 Tags');
  console.log('   - 4 News Articles (3 published, 1 draft)');
  console.log('   - 5 Stock Analysis (4 published, 1 draft)');
  console.log('\n🔑 Login Credentials:');
  console.log('   Email: admin@sahambagus.com / editor@sahambagus.com / author@sahambagus.com');
  console.log('   Password: Password123!@#\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });