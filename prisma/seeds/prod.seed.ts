import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('Production Seed Setup\n');
  console.log('WARNING: This should only be run ONCE on a fresh production database!\n');

  // Safety Check 1: Environment
  if (process.env.NODE_ENV === 'development') {
    const confirm = await question('⚠️  You are in DEVELOPMENT mode. Continue anyway? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Seed cancelled.');
      process.exit(0);
    }
  }

  // Safety Check 2: Existing data
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log(`❌ Database already has ${existingUsers} user(s)!`);
    console.log('❌ Production seed should only run on an empty database.');
    console.log('❌ Seed cancelled for safety.\n');
    process.exit(1);
  }

  const existingCategories = await prisma.category.count();
  if (existingCategories > 0) {
    console.log(`⚠️  Database already has ${existingCategories} categories.`);
    const confirm = await question('Continue anyway? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Seed cancelled.');
      process.exit(0);
    }
  }

  console.log('\n📝 Creating Super Admin Account\n');

  // Get admin details
  const email = await question('Admin Email: ');
  if (!email || !email.includes('@')) {
    console.log('❌ Invalid email address.');
    process.exit(1);
  }

  const firstName = await question('First Name: ');
  if (!firstName || firstName.trim().length < 2) {
    console.log('❌ First name must be at least 2 characters.');
    process.exit(1);
  }

  const lastName = await question('Last Name: ');
  if (!lastName || lastName.trim().length < 2) {
    console.log('❌ Last name must be at least 2 characters.');
    process.exit(1);
  }

  let password: string;
  let passwordConfirm: string;

  // Password input with validation
  while (true) {
    password = await question('Password (min 8 chars, uppercase, lowercase, number, special): ');
    
    // Validate password complexity
    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters.');
      continue;
    }
    if (!/[a-z]/.test(password)) {
      console.log('❌ Password must contain at least one lowercase letter.');
      continue;
    }
    if (!/[A-Z]/.test(password)) {
      console.log('❌ Password must contain at least one uppercase letter.');
      continue;
    }
    if (!/\d/.test(password)) {
      console.log('❌ Password must contain at least one number.');
      continue;
    }
    if (!/[@$!%*?&]/.test(password)) {
      console.log('❌ Password must contain at least one special character (@$!%*?&).');
      continue;
    }

    passwordConfirm = await question('Confirm Password: ');
    if (password !== passwordConfirm) {
      console.log('❌ Passwords do not match. Try again.\n');
      continue;
    }

    break;
  }

  console.log('\n🔐 Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create super admin
  console.log('👤 Creating super admin...');
  const admin = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}\n`);

  // Ask about default categories
  const createCategories = await question('Create default categories? (yes/no): ');

  if (createCategories.toLowerCase() === 'yes') {
    console.log('\n📁 Creating default categories...');
    
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
          description: 'Berita dan analisis cryptocurrency',
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
          description: 'Berita komoditas dan sumber daya alam',
          color: '#8b5cf6',
          icon: '🌾',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Ekonomi Makro',
          slug: 'ekonomi-makro',
          description: 'Analisis ekonomi dan kebijakan makro',
          color: '#ec4899',
          icon: '🏛️',
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} default categories\n`);
  }

  console.log('🎉 Production seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Super Admin: ${admin.email}`);
  console.log(`   - Role: ${admin.role}`);
  if (createCategories.toLowerCase() === 'yes') {
    console.log('   - 5 Default Categories');
  }
  console.log('\n🔑 Next Steps:');
  console.log('   1. Login with your admin credentials');
  console.log('   2. Create additional users via /auth/register or admin panel');
  console.log('   3. Start creating content!\n');
  console.log('⚠️  IMPORTANT: Save your admin credentials securely!\n');
}

main()
  .catch((e) => {
    console.error('❌ Production seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });