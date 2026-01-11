export type User = {
  id: string
  name: string
  email: string
  profilePicture?: string
  role: 'admin' | 'technician' | 'client'
  openingHours?: number[]
  password?: string
  createdAt: string
  updatedAt: string
}

export const users: User[] = [
  {
    id: 'a725df2b-c65c-4c6f-aec3-0f962c119db1',
    name: 'André Costa',
    email: 'andre.costa@client.com',
    role: 'client',
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '99daede6-3b8d-4378-b223-4acb71b06ce3',
    name: 'Julia Maria',
    email: 'julia.maria@client.com',
    role: 'client',
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: 'ba8ffeea-4c6a-47a1-89fa-4bd368b6c213',
    name: 'Aline Souza',
    email: 'aline.souza@client.com',
    role: 'client',
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '9b06cd7e-d576-43b8-aabd-d9934d10c602',
    name: 'Marcelo Andrade',
    email: 'marcelo.andrade@client.com',
    role: 'client',
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: 'b3427562-4133-4d97-8607-2a40e012434e',
    name: 'Suzane Moura',
    email: 'suzane.moura@client.com',
    role: 'client',
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '6d7a9960-f733-4de1-84b4-347dc993c585',
    name: 'Carlo Silva',
    email: 'carlos.silva@email.com',
    role: 'technician',
    openingHours: [8, 9, 10, 11, 13, 14, 15, 16],
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '58302e7f-7b7e-4691-b436-3686b38fe494',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@test.com',
    role: 'technician',
    openingHours: [13, 14, 15, 16],
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '98ae3f2f-ba13-4f62-b7fd-6f8e34676896',
    name: 'Cíntia Lúcia',
    email: 'cintia.lucia@test.com',
    role: 'technician',
    openingHours: [8, 9, 14, 15, 18],
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
  {
    id: '78eb2855-ec67-4b41-825a-818477839564',
    name: 'Marcos Alves',
    email: 'marcos.alves@test.com',
    role: 'technician',
    openingHours: [7, 9, 11, 15, 17, 19, 20],
    createdAt: '2025-12-15T13:02:23.846Z',
    updatedAt: '2025-12-15T13:02:23.846Z',
  },
]
