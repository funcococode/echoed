'use client';

import { getAllPosts, type PostType } from '@/actions/post';
import { getUser, type UserType } from '@/actions/user';
import PostCard from '@/components/ui/post/post-card';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { TbCalendar, TbNotes, TbUser, TbShare, TbUserHeart, TbUserStar } from 'react-icons/tb';
import FollowButton from '../../_components/follow-button';
import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();

  const [data, setData] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.replace('/');
      return;
    }

    let active = true;
    void (async () => {
      try {
        setLoading(true);
        const [u, p] = await Promise.all([getUser({ id }), getAllPosts({ userId: id })]);
        if (!active) return;
        setData(u ?? null);
        setPosts(
          (p?.data ?? []).map(post => ({
            ...post,
            urls: post.urls ? post.urls.map(url => Promise.resolve(url)) : undefined,
          }))
        );
      } catch {
        if (!active) return;
        setErr('Could not load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, router]);

  const initials = useMemo(() => {
    const fi = (data?.firstname?.[0] ?? '').toUpperCase();
    const li = (data?.lastname?.[0] ?? '').toUpperCase();
    return (fi + li || data?.username?.[0] || '?').toUpperCase();
  }, [data]);

  const stats = useMemo(
    () => [
      { label: 'Followers', value: data?._count?.followers ?? 0, icon: <TbUserHeart className="h-4 w-4" /> },
      { label: 'Followings', value: data?._count?.following ?? 0, icon: <TbUserStar className="h-4 w-4" /> },
      { label: 'Echoes', value: data?._count?.Posts ?? 0, icon: <TbNotes className="h-4 w-4" /> },
      // { label: 'Tags Followed', value: data?._count?.TagsFollowed ?? 0, icon: <TbHash className="h-4 w-4" /> },
      {
        label: 'Joined',
        value: data?.createdAt ? moment(data.createdAt).format('MMM DD, YYYY') : '—',
        icon: <TbCalendar className="h-4 w-4" />,
      },
    ],
    [data]
  );

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6">
      {/* Top card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        {/* soft cover bar */}
        <div className="h-20 bg-[radial-gradient(120%_80%_at_0%_0%,#e2e8f0_0%,transparent_45%),radial-gradient(120%_80%_at_100%_0%,#f1f5f9_0%,transparent_45%)]" />

        <div className="flex flex-col gap-5 px-6 pb-6 pt-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white text-lg font-semibold text-slate-700 shadow-sm">
              {initials || <TbUser className="h-6 w-6 text-slate-400" />}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold text-slate-900">
                  {data?.firstname} {data?.lastname}
                </h1>
                {data?.username && (
                  <span className="truncate text-sm text-slate-500">(@{data.username})</span>
                )}
              </div>
              {data?.email && (
                <div className="mt-0.5 text-sm text-slate-500">{data.email}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {session?.data?.user?.id !== id && <FollowButton targetUserId={id} />}
            <button
              type="button"
              onClick={() =>
                navigator?.share?.({
                  title: `${data?.firstname ?? ''} ${data?.lastname ?? ''}`.trim(),
                  url: typeof window !== 'undefined' ? window.location.href : undefined,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <TbShare className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-200 bg-slate-50/60 px-6 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium tracking-wide text-slate-500">{s.label}</div>
                  <div className="text-slate-400">{s.icon}</div>
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{s.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading bar */}
        {loading && (
          <div className="h-0.5 w-full overflow-hidden bg-gray-100">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-slate-400 to-transparent"
            />
          </div>
        )}
      </motion.div>

      {/* Posts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <span className="inline-block h-4 w-1 rounded bg-slate-800/80" />
            Echoes
            <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs text-slate-600 shadow-sm">
              {loading ? '—' : posts?.length ?? 0}
            </span>
          </h2>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 h-4 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="mt-3 h-28 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {err && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && posts?.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-gray-200 bg-slate-50 text-slate-500">
              <TbNotes className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-slate-800">No Echoes yet</div>
            <div className="mt-1 text-xs text-slate-500">
              When they publish, their Echoes will appear here.
            </div>
          </div>
        )}

        {/* List */}
        {!loading && !err && posts?.length > 0 && (
          <div className="space-y-6">
            {posts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.2 }}
              >
                <PostCard post={item} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
