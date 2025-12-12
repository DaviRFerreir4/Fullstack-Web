import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Davi',
        email: 'davi@email.com',
        password: await hash('Drowssap1.', 10),
        role: 'admin',
      },
      {
        name: 'Paulo',
        email: 'paulo@email.com',
        password: await hash('Drowssap1.', 10),
        role: 'technician',
      },
      {
        name: 'Sara',
        email: 'sara@email.com',
        password: await hash('Drowssap1.', 10),
        role: 'technician',
      },
      {
        name: 'Flavia',
        email: 'flavia@email.com',
        password: await hash('Drowssap1.', 10),
        role: 'technician',
      },
    ],
  })

  const technicians = await prisma.user.findMany({
    where: { role: 'technician' },
  })

  await prisma.openingHour.createMany({
    data: [
      {
        userId: technicians[0].id,
        availableHours: [8, 9, 10, 11, 14, 15, 16, 17],
      },
      {
        userId: technicians[1].id,
        availableHours: [10, 11, 12, 13, 16, 17, 18, 19],
      },
      {
        userId: technicians[2].id,
        availableHours: [12, 13, 14, 15, 18, 19, 20, 21],
      },
    ],
  })

  await prisma.service.createMany({
    data: [
      {
        type: 'Instalação e atualização de software',
        value: 56.49,
      },
      {
        type: 'Instalação e atualização de hardware',
        value: 109.59,
      },
      {
        type: 'Diagnóstico e remoção de vírus',
        value: 178.99,
      },
      {
        type: 'Suporte a impressora e periféricos',
        value: 75.99,
      },
      {
        type: 'Configuração de VPN e acesso remoto',
        value: 84.39,
      },
    ],
  })
}

seed()
  .then(() => {
    console.log('Database seeded')
    prisma.$disconnect()
  })
  .catch((error) => {
    console.log(error)
    prisma.$disconnect()
    process.exit(1)
  })
