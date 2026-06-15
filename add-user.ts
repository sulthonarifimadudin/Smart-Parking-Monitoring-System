import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.userAccount.upsert({
    where: { username: 'sulthon' },
    update: {},
    create: {
      username: 'sulthon',
      full_name: 'Sulthon Arif',
      role: 'ADMIN',
      status: 'ACTIVE',
      email: 'sulthonarifimadudin@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sulthon',
    },
  });
  console.log('User created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
