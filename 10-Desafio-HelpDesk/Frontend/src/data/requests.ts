import { type Service } from './services'
import { type User } from './users'
import { users } from './users'
import { services } from './services'

export type Request = {
  id: number
  title: string
  description: string
  status: 'opened' | 'in_progress' | 'closed'
  services: { service: Service; createdAt: string }[]
  client: User
  technician: User
  createdAt: string
  updatedAt: string
}

export const requests: Request[] = [
  {
    id: 3,
    title: 'Rede lenta',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'opened',
    services: [
      { createdAt: '2025-04-13T20:56:00.000Z', service: services[0] },
      { createdAt: '', service: services[3] },
    ],
    client: users[0],
    technician: users[5],
    createdAt: '2025-04-13T20:56:00.000Z',
    updatedAt: '2025-04-13T20:56:00.000Z',
  },
  {
    id: 4,
    title: 'Backup não está funcionando',
    description:
      'O sistema de backup automático parou de funcionar. Última execução bem-sucedida foi há uma semana.',
    status: 'closed',
    services: [
      { createdAt: '2025-04-12T09:12:00.000Z', service: services[1] },
      { createdAt: '2025-04-12T13:25:00.000Z', service: services[4] },
      { createdAt: '2025-04-12T15:20:00.000Z', service: services[5] },
    ],
    client: users[0],
    technician: users[5],
    createdAt: '2025-04-12T09:12:00.000Z',
    updatedAt: '2025-04-12T15:20:00.000Z',
  },
  {
    id: 1,
    title: 'Computador não liga',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'in_progress',
    services: [{ createdAt: '2025-04-12T09:01:00.000Z', service: services[2] }],
    client: users[2],
    technician: users[5],
    createdAt: '2025-04-12T09:01:00.000Z',
    updatedAt: '2025-04-12T09:01:00.000Z',
  },
  {
    id: 12,
    title: 'Computador não liga',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'in_progress',
    services: [{ createdAt: '2025-04-12T09:01:00.000Z', service: services[2] }],
    client: users[2],
    technician: users[5],
    createdAt: '2025-04-12T09:01:00.000Z',
    updatedAt: '2025-04-12T09:01:00.000Z',
  },
  {
    id: 123,
    title: 'Computador não liga',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'in_progress',
    services: [{ createdAt: '2025-04-12T09:01:00.000Z', service: services[2] }],
    client: users[2],
    technician: users[5],
    createdAt: '2025-04-12T09:01:00.000Z',
    updatedAt: '2025-04-12T09:01:00.000Z',
  },
  {
    id: 2,
    title: 'Instalação de software de gestão',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'closed',
    services: [{ createdAt: '2025-04-10T10:15:00.000Z', service: services[3] }],
    client: users[1],
    technician: users[6],
    createdAt: '2025-04-10T10:15:00.000Z',
    updatedAt: '2025-04-10T10:15:00.000Z',
  },
  {
    id: 5,
    title: 'Meu fone não conecta no computador',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum id sapiente, cumque voluptatibus.',
    status: 'closed',
    services: [{ createdAt: '2025-04-11T15:16:00.000Z', service: services[3] }],
    client: users[4],
    technician: users[6],
    createdAt: '2025-04-11T15:16:00.000Z',
    updatedAt: '2025-04-11T15:16:00.000Z',
  },
]
