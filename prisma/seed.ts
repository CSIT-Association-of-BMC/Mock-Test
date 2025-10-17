import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Create Subjects
    const subjects = [
        'Physics',
        'Chemistry',
        'Mathematics',
        'English',
        'Computer Science'
    ];

    for (const subjectName of subjects) {
        await prisma.subject.upsert({
            where: { name: subjectName },
            update: {},
            create: { name: subjectName },
        });
    }

    console.log('✓ Created subjects');

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.upsert({
        where: { email: 'admin@csitabmc.com' },
        update: {},
        create: {
            email: 'admin@csitabmc.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('✓ Created default admin (email: admin@csitabmc.com, password: admin123)');
    console.log('Database seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
