import { PrismaClient } from "@prisma/client";

type PrismaGlobal = typeof globalThis & {
  macrochefPrisma?: PrismaClient;
};

export function getDb() {
  const globalForPrisma = globalThis as PrismaGlobal;

  if (!globalForPrisma.macrochefPrisma) {
    globalForPrisma.macrochefPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return globalForPrisma.macrochefPrisma;
}
