import { PrismaClient, Prisma } from '../../generated/prisma';

const prisma = new PrismaClient();

export default prisma;
export { Prisma };