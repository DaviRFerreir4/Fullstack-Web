import { PrismaClient } from './generate/client'

const prisma = new PrismaClient({
  log: ['query'],
})

export { prisma }
