"use server";
import { auth } from "@/auth";
import { db } from "@/server/db";

export type TagType = {
  id: string;
  name: string;
};

export async function addTagToPost({
  tag,
  postId,
}: {
  tag: string;
  postId: string;
}) {
  const session = await auth();
  if (session?.user?.id) {
    const response = await db.tag.create({
      data: {
        name: tag,
        postId,
        userId: session?.user?.id,
      },
      select: {
        id: true,
      },
    });

    return response;
  }
}

export async function getPostTags({ postId }: { postId: string }) {
  const session = await auth();
  if (session?.user?.id) {
    const response = await db.tag.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return response;
  }
}
