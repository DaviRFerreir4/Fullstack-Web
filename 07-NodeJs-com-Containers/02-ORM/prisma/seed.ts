import { prisma } from '@/prisma.js'

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Victor',
        email: 'vitor@email.com',
      },
      {
        name: 'Lara',
        email: 'lara@email.com',
      },
      {
        name: 'Gabriel',
        email: 'gabriel@email.com',
      },
    ],
  })
}

seed().then(() => {
  console.log('Database seeded')
  prisma.$disconnect()
})

// para executar o seed, inclua ele no package.json e rode npx prisma db seed
