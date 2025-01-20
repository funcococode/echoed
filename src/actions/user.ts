"use server";

import { db } from "@/server/db";

export type UserType =
  ReturnType<typeof getUser> extends Promise<infer T> ? T : never;
export async function getUser({ id }: { id: string }) {
  const data = await db.user.findFirst({
    where: {
      id: id,
    },
    include: {
      _count: {
        select: {
          Posts: true,
          tag: true,
        },
      },
    },
  });

  return data;
}
