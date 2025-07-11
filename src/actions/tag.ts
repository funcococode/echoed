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
    const foundTag = await db.tag.findFirst({
      where: {
        name: tag,
      },
      select: {
        id: true,
      },
    });
    let tagId;
    if (foundTag?.id) {
      tagId = foundTag.id;
    } else {
      const newTag = await db.tag.create({
        data: {
          name: tag,
        },
        select: {
          id: true,
        },
      });
      tagId = newTag.id;
    }
    const response = await db.tagsOnPost.create({
      data: {
        tagId: tagId,
        postId,
      },
      select: {
        tag: {
          select: {
            id: true,
          },
        },
      },
    });

    return { id: response.tag.id };
  }
}

export async function getPostTags({
  postId,
  // tagId,
}: {
  postId: string;
  // tagId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = (await db.tagsOnPost.findMany({
      where: {
        postId,
        // tagId,
      },
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })) as { tag: { id: string; name: string } }[];

    return response.map((item) => ({ id: item.tag.id, name: item.tag.name }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching tags:", error.message);
      throw new Error("Unable to fetch tags.");
    }
    throw new Error("An unknown error occurred.");
  }
}
