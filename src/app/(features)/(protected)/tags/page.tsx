// app/(dashboard)/tags/page.tsx
import PageHeading from "@/components/ui/page-heading";
import { db } from "@/server/db";
import { TbHash, TbTag } from "react-icons/tb";
import TagsClient from "./tags-client";

export const dynamic = "force-dynamic"; // optional, if these change often

export default async function Tags() {
  const data = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { posts: true } },
    },
  });

  const totalTags = data.length;
  const totalPosts = data.reduce((sum, t) => sum + t._count.posts, 0);

  return (
    <div className="space-y-6">
      <PageHeading text="Tags" count={totalTags} icon={<TbTag />} />

      {/* Top summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard
          title="Total Tags"
          value={totalTags.toLocaleString()}
          icon={<TbHash className="h-5 w-5" />}
        />
        <StatCard
          title="Tagged Posts"
          value={totalPosts.toLocaleString()}
          icon={<TbTag className="h-5 w-5" />}
        />
      </div>

      {/* Interactive grid (client) */}
      <TagsClient initialData={data} />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.01] p-4">
      <div className="absolute inset-px rounded-2xl ring-1 ring-white/[0.06] pointer-events-none" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="opacity-80">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="text-xl font-semibold tracking-tight">{value}</div>
      </div>
    </div>
  );
}
