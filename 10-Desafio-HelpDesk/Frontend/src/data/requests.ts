import { type Service } from './services'
import { type User } from './users'
import { users } from './users'
import { services } from './services'

type Request = {
  id: number
  title: string
  status: 'opened' | 'in_progress' | 'closed'
  services: Service[]
  client: User
  technician: User
  createdAt: string
  updatedAt: string
}

export const requests: Request[] = [
  {
    id: 3,
    title: 'Rede lenta',
    status: 'opened',
    services: [services[0], services[3]],
    client: users[0],
    technician: users[5],
    createdAt: '2025-04-13T20:56:00.000Z',
    updatedAt: '2025-04-13T20:56:00.000Z',
  },
  {
    id: 4,
    title: 'Backup não está funcionando',
    status: 'opened',
    services: [services[1]],
    client: users[0],
    technician: users[5],
    createdAt: '2025-04-12T15:20:00.000Z',
    updatedAt: '2025-04-12T15:20:00.000Z',
  },
  {
    id: 1,
    title: 'Computador não liga',
    status: 'in_progress',
    services: [services[2]],
    client: users[2],
    technician: users[5],
    createdAt: '2025-04-12T09:01:00.000Z',
    updatedAt: '2025-04-12T09:01:00.000Z',
  },
  {
    id: 2,
    title: 'Instalação de software de gestão',
    status: 'closed',
    services: [services[3]],
    client: users[1],
    technician: users[6],
    createdAt: '2025-04-10T10:15:00.000Z',
    updatedAt: '2025-04-10T10:15:00.000Z',
  },
  {
    id: 5,
    title: 'Meu fone não conecta no computador',
    status: 'closed',
    services: [services[3]],
    client: users[4],
    technician: users[6],
    createdAt: '2025-04-11T15:16:00.000Z',
    updatedAt: '2025-04-11T15:16:00.000Z',
  },
]
