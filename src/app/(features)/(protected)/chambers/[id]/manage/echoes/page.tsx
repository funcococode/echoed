import { notFound } from "next/navigation";
import ManageEchoesClient from "./client";
import { db } from "@/server/db";

interface Props {
    params: { id: string };
    searchParams?: {
        q?: string;
        status?: "all" | "draft" | "published" | "archived";
        page?: string;
    };
}

export default async function ManageEchoes({ params, searchParams }: Props) {
    const id = params.id;
    const q = (searchParams?.q ?? "").trim();
    // const status = (searchParams?.status as Props["searchParams"]["status"]) ?? "all";
    const page = Math.max(1, Number(searchParams?.page ?? 1));
    const pageSize = 10;

    const chamber = await db.chamber.findUnique({
        where: { id },
        select: { id: true, name: true, description: true },
    });

    if (!chamber) notFound();

    const where = {
        Chamber: {
            some: {
                id: chamber.id,
            }
        },
        ...(q
            ? {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                ],
            }
            : {}),
        // ...(status && status !== "all"
        //     ? { status } // ⟵ if your Post model doesn’t have `status`, remove this line
        //     : {}),
    };

    const [items, total] = await Promise.all([
        db.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: pageSize,
            skip: (page - 1) * pageSize,
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        image: true,
                        email: true,
                        username: true
                    },
                },
                views: true,
                _count: {
                    select: {
                        saves: true,
                        votes: true,
                        tags: true
                    }
                },
                PinnedChamberEchoes: {
                    where: { chamberId: chamber.id },
                    select: { id: true }
                }
            },
        }),
        db.post.count({ where: { Chamber: { some: { id: chamber.id } } } }),
    ]);

    const mappedArr = items.map(item => ({
        ...item,
        isPinned: item.PinnedChamberEchoes.length > 0
    }));

    return (
        <ManageEchoesClient
            chamber={{ id: chamber.id, name: chamber.name }}
            initial={{ items: mappedArr, total, page, pageSize, q }}
        />
    );
}
