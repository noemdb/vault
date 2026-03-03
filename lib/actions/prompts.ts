"use server";

import { auth } from "@/auth";
import { AIModel, PromptStatus, SharedPrompt } from "@/types/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import slugify from "slugify";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'sslmode=verify-full' 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function generateSHA(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function createPromptAction(data: {
  title: string;
  description?: string;
  content: string;
  system_prompt?: string;
  model: AIModel;
  category_id?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const slug = slugify(data.title, { lower: true, strict: true }) + "-" + Math.random().toString(36).substring(2, 7);
  const sha = generateSHA(data.content + (data.system_prompt || ""));

  const prompt = await prisma.$transaction(async (tx) => {
    const newPrompt = await tx.prompt.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        system_prompt: data.system_prompt,
        model: data.model,
        author_id: session.user.id!,
        category_id: data.category_id,
        status: PromptStatus.draft,
      },
    });

    await tx.promptVersion.create({
      data: {
        prompt_id: newPrompt.id,
        version: 1,
        sha,
        content: data.content,
        system_prompt: data.system_prompt,
        author_id: session.user.id!,
        change_note: "Versión inicial",
      },
    });

    return newPrompt;
  });

  revalidatePath("/prompts");
  return prompt;
}

export async function getPromptsAction(filters?: {
  searchTerm?: string;
  category?: string;
  status?: PromptStatus;
}): Promise<SharedPrompt[]> {
  const where: import("@prisma/client").Prisma.PromptWhereInput = {};

  if (filters?.searchTerm) {
    where.OR = [
      { title: { contains: filters.searchTerm, mode: "insensitive" } },
      { description: { contains: filters.searchTerm, mode: "insensitive" } },
    ];
  }

  if (filters?.category) {
    where.category_id = filters.category;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return await prisma.prompt.findMany({
    where,
    include: {
      author: {
        include: { profile: true }
      },
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { versions: true } }
    },
    orderBy: { updated_at: "desc" },
  }) as unknown as SharedPrompt[];
}

export async function getPromptBySlugAction(slug: string) {
  return await prisma.prompt.findUnique({
    where: { slug },
    include: {
      author: { include: { profile: true } },
      category: true,
      versions: {
        orderBy: { version: "desc" },
        include: { author: { include: { profile: true } } }
      },
      variables: true,
      tags: { include: { tag: true } },
    }
  });
}

export async function commitVersionAction(promptId: string, data: {
  content: string;
  system_prompt?: string;
  change_note: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const lastVersion = await prisma.promptVersion.findFirst({
    where: { prompt_id: promptId },
    orderBy: { version: "desc" },
  });

  const nextVersionNumber = (lastVersion?.version || 0) + 1;
  const sha = generateSHA(data.content + (data.system_prompt || ""));

  const result = await prisma.$transaction(async (tx) => {
    const version = await tx.promptVersion.create({
      data: {
        prompt_id: promptId,
        version: nextVersionNumber,
        sha,
        content: data.content,
        system_prompt: data.system_prompt,
        change_note: data.change_note,
        author_id: session.user.id!,
      },
    });

    await tx.prompt.update({
      where: { id: promptId },
      data: {
        content: data.content,
        system_prompt: data.system_prompt,
      },
    });

    return version;
  });

  revalidatePath(`/prompts`);
  return result;
}
