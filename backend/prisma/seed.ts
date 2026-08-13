import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@midnightacademy.local' },
    update: {},
    create: {
      email: 'admin@midnightacademy.local',
      role: Role.ADMIN,
      fullName: 'Admin User',
      // TEMPORARY: Plaintext password placeholder for Phase 2. To be replaced in Phase 3.
      passwordHash: 'password',
    },
  });

  // Create student user
  const student = await prisma.user.upsert({
    where: { email: 'student@midnightacademy.local' },
    update: {},
    create: {
      email: 'student@midnightacademy.local',
      role: Role.STUDENT,
      fullName: 'Student User',
      institution: 'Midnight Academy',
      year: 'Senior',
      // TEMPORARY: Plaintext password placeholder for Phase 2. To be replaced in Phase 3.
      passwordHash: 'password',
    },
  });

  console.log('Database seeded successfully:');
  console.log(`Admin: ${admin.email}`);
  console.log(`Student: ${student.email}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
