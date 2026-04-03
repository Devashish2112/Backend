import { PrismaClient, Role, Status, RecordType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const analystPassword = await bcrypt.hash('Analyst@123', 10);
  const viewerPassword = await bcrypt.hash('Viewer@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.com' },
    update: {},
    create: {
      email: 'admin@finance.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.com' },
    update: {},
    create: {
      email: 'analyst@finance.com',
      passwordHash: analystPassword,
      fullName: 'Analyst User',
      role: Role.ANALYST,
      status: Status.ACTIVE,
    },
  });
  console.log('✅ Created analyst user:', analyst.email);

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.com' },
    update: {},
    create: {
      email: 'viewer@finance.com',
      passwordHash: viewerPassword,
      fullName: 'Viewer User',
      role: Role.VIEWER,
      status: Status.ACTIVE,
    },
  });
  console.log('✅ Created viewer user:', viewer.email);

  const adminRecords = [
    {
      userId: admin.id,
      amount: 5000.00,
      type: RecordType.INCOME,
      category: 'Salary',
      date: new Date('2024-01-15'),
      description: 'Monthly salary payment',
    },
    {
      userId: admin.id,
      amount: 1200.00,
      type: RecordType.EXPENSE,
      category: 'Rent',
      date: new Date('2024-01-05'),
      description: 'Monthly rent payment',
    },
    {
      userId: admin.id,
      amount: 350.00,
      type: RecordType.EXPENSE,
      category: 'Groceries',
      date: new Date('2024-01-10'),
      description: 'Weekly grocery shopping',
    },
    {
      userId: admin.id,
      amount: 150.00,
      type: RecordType.EXPENSE,
      category: 'Utilities',
      date: new Date('2024-01-08'),
      description: 'Electricity and water bills',
    },
    {
      userId: admin.id,
      amount: 2000.00,
      type: RecordType.INCOME,
      category: 'Freelance',
      date: new Date('2024-01-20'),
      description: 'Freelance project payment',
    },
  ];

  const analystRecords = [
    {
      userId: analyst.id,
      amount: 4500.00,
      type: RecordType.INCOME,
      category: 'Salary',
      date: new Date('2024-01-15'),
      description: 'Monthly salary',
    },
    {
      userId: analyst.id,
      amount: 1000.00,
      type: RecordType.EXPENSE,
      category: 'Rent',
      date: new Date('2024-01-05'),
      description: 'Rent payment',
    },
    {
      userId: analyst.id,
      amount: 200.00,
      type: RecordType.EXPENSE,
      category: 'Transportation',
      date: new Date('2024-01-12'),
      description: 'Monthly transit pass',
    },
    {
      userId: analyst.id,
      amount: 500.00,
      type: RecordType.INCOME,
      category: 'Bonus',
      date: new Date('2024-01-25'),
      description: 'Performance bonus',
    },
  ];

  const viewerRecords = [
    {
      userId: viewer.id,
      amount: 3500.00,
      type: RecordType.INCOME,
      category: 'Salary',
      date: new Date('2024-01-15'),
      description: 'Monthly salary',
    },
    {
      userId: viewer.id,
      amount: 800.00,
      type: RecordType.EXPENSE,
      category: 'Rent',
      date: new Date('2024-01-05'),
      description: 'Rent payment',
    },
    {
      userId: viewer.id,
      amount: 100.00,
      type: RecordType.EXPENSE,
      category: 'Entertainment',
      date: new Date('2024-01-18'),
      description: 'Movie and dinner',
    },
  ];

  const allRecords = [...adminRecords, ...analystRecords, ...viewerRecords];
  
  for (const record of allRecords) {
    await prisma.financialRecord.create({
      data: record,
    });
  }

  console.log(`✅ Created ${allRecords.length} financial records`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
