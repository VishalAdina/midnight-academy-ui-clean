import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/common/utils/password.util';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const adminPassword = await hashPassword('admin123');
  const studentPassword = await hashPassword('student123');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@midnightacademy.local' },
    update: {
      passwordHash: adminPassword,
    },
    create: {
      email: 'admin@midnightacademy.local',
      role: Role.ADMIN,
      fullName: 'Admin User',
      passwordHash: adminPassword,
    },
  });

  // Create student user
  const student = await prisma.user.upsert({
    where: { email: 'student@midnightacademy.local' },
    update: {
      passwordHash: studentPassword,
    },
    create: {
      email: 'student@midnightacademy.local',
      role: Role.STUDENT,
      fullName: 'Student User',
      institution: 'Midnight Academy',
      year: 'Senior',
      passwordHash: studentPassword,
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
