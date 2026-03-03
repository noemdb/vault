// prisma/seed.ts
import { UserRole } from "../types/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'sslmode=verify-full' 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create Roles
  const roles = [
    { name: UserRole.admin },
    { name: UserRole.engineer },
    { name: UserRole.editor },
    { name: UserRole.viewer },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("Roles seeded.");

  // 2. Create Admin User
  const adminEmail = "admin@promptvault.pip";
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminRole = await prisma.role.findUnique({
    where: { name: UserRole.admin },
  });

  if (!adminRole) throw new Error("Admin role not found");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password_hash: hashedPassword,
      role_id: adminRole.id,
      profile: {
        create: {
          full_name: "PIP Administrator",
          username: "admin",
        },
      },
    },
  });

  console.log(`Admin user created: ${admin.email}`);
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
