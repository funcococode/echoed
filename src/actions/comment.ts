"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";

// export type CommentType =
//   ReturnType<typeof getComments> extends Promise<infer T> ? T : never;
export type CommentType = {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
  };
} & {
  path: string;
  id: string;
  postId: string;
  userId: string;
  description: string;
  parentCommentId: string | null;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
  replies: CommentType[];
};

function nestComments(comments: CommentType[]) {
  const commentMap: Record<string, CommentType> = {};
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment.id] = comment;
  });

  const nestedComments: CommentType[] = [];

  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      commentMap[comment.parentCommentId]?.replies.push(comment);
    } else {
      nestedComments.push(comment);
    }
  });

  return nestedComments;
}

export async function getComments(postId: string) {
  const response = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const data = response.map((comment) => ({
    ...comment,
    replies: [],
  })) as CommentType[];

  return nestComments(data);
}

export async function postComment({
  postId,
  comment,
  parentCommentId,
}: {
  postId: string;
  comment: string;
  parentCommentId?: string;
}) {
  const userId = (await auth())?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let depth = 0;
  let path = "";

  if (parentCommentId) {
    // Fetch the parent comment to calculate depth and path
    const parentComment = await db.comment.findUnique({
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    // Increment depth and extend the path
    depth = parentComment.depth + 1;
    path = `${parentComment.path}.${parentCommentId}`;
  } else {
    // Root-level comment
    path = `${postId}`;
  }

  // Create the new comment
  const response = await db.comment.create({
    data: {
      postId,
      userId,
      description: comment,
      parentCommentId: parentCommentId,
      depth,
      path,
    },
  });

  return response;
}

export async function postReply({
  postId,
  parentCommentId,
  description,
}: {
  postId: string;
  parentCommentId: string;
  description: string;
}) {
  const userId = (await auth())?.user?.id;

  if (!postId || !parentCommentId || !userId || !description) {
    throw new Error("Missing required fields.");
  }

  try {
    const parentComment = await db.comment.findUnique({
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment not found.");
    }

    const newReply = await db.comment.create({
      data: {
        postId,
        userId,
        description,
        parentCommentId,
      },
    });

    return {
      success: true,
      message: "Reply created successfully.",
      reply: newReply,
    };
  } catch (error) {
    throw new Error(`Error posting reply: ${error.message}`);
  }
}
