"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { remark } from "remark";
import strip from "strip-markdown";

export type PostType =
  ReturnType<typeof getPost> extends Promise<infer T> ? T : never;

export async function getPost(postId: string) {
  const session = await auth();
  const data = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      _count: {
        select: {
          comments: true,
          votes: true,
          saves: true,
          tag: true,
        },
      },
      votes: true,
      saves: {
        select: {
          userId: true,
        },
      },
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  const mappedData = {
    ...data,
    votedByMe: data?.votes.some((vote) => vote.userId === session?.user?.id),
    bookmarked: data?.saves.some((item) => item.userId === session?.user?.id),
    votePositive: data?.votes.some(
      (vote) => vote.userId === session?.user?.id && vote.positive,
    ),
    readTime: Math.round(data?.description?.split(" ")?.length ?? 0 / 200),
  };
  return mappedData;
}

export async function getAllPosts({
  page = 0,
  limit = 5,
  userId = null,
}: {
  page?: number;
  limit?: number;
  userId?: string | null;
}) {
  const session = await auth();

  const skip = page * limit;
  const response = await db.post.findMany({
    skip,
    take: limit,
    where: {
      ...(userId && { userId }),
    },
    include: {
      _count: {
        select: {
          comments: true,
          votes: true,
          saves: true,
          tag: true,
        },
      },
      saves: {
        select: {
          userId: true,
        },
      },
      votes: true,
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const data = response.map((post) => ({
    ...post,
    votedByMe: post.votes.some((vote) => vote.userId === session?.user?.id),
    bookmarked: post.saves.some((item) => item.userId === session?.user?.id),
    votePositive: post.votes.some(
      (vote) => vote.userId === session?.user?.id && vote.positive,
    ),
    readTime: post?.main_text?.length
      ? Math.round(
          String(remark().use(strip).process(post.main_text))?.length ??
            0 / 200,
        )
      : 0,
  }));

  const total_count = await db.post.count();

  return {
    data,
    pageInfo: {
      total_count,
      page,
      limit,
      total_pages: Math.floor(total_count / limit) + 1,
    },
  };
}

export type PostDetailType =
  ReturnType<typeof getPostDetails> extends Promise<infer T> ? T : never;
export async function getPostDetails(postId: string) {
  const response = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      user: true,
      votes: true,
      _count: true,
      tag: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return response;
}

export const updateViewCount = async (id: string) => {
  await db.post.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};
