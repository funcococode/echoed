import { notFound } from "next/navigation";
import { db } from "@/server/db";
import ManageMembersClient from "./client";

interface Props {
    params: { id: string };
    searchParams?: {
        q?: string;
        status?: "all" | "draft" | "published" | "archived";
        page?: string;
    };
}

export default async function ManageMembers({ params, searchParams }: Props) {
    const id = params.id;
    const q = (searchParams?.q ?? "").trim();
    const page = Math.max(1, Number(searchParams?.page ?? 1));
    const pageSize = 10;

    const chamber = await db.chamber.findUnique({
        where: { id },
        select: { id: true, name: true, description: true },
    });

    if (!chamber) notFound();

    const where = {
        chamberId: id,
        ...(q
            ? {
                user: {
                    OR: [
                        { firstname: { contains: q } },
                        { lastname: { contains: q } },
                        { email: { contains: q } },
                        { username: { contains: q } },
                    ]
                }
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        db.chamberMember.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: pageSize,
            skip: (page - 1) * pageSize,
            select: {
                user: {
                    select: {
                        id: true,
                        image: true,
                        email: true,
                        username: true,
                        firstname: true,
                        lastname: true
                    },
                },
                createdAt: true,
            },
        }),
        db.chamberMember.count({ where: { chamberId: chamber.id } }),
    ]);

    const mappedItems = items.map(item => ({
        id: item.user.id,
        username: item.user.username,
        email: item.user.email,
        image: item.user.image,
        name: `${item.user.firstname} ${item.user.lastname}`,
        createdAt: item.createdAt,
    }));

    return (
        <ManageMembersClient
            chamber={{ id: chamber.id, name: chamber.name, description: chamber.description ?? '' }}
            initial={{ items: mappedItems, total, page, pageSize, q }}
        />
    );
}
