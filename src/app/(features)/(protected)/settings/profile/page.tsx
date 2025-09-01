'use client';

import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/utils/cn';
import { getUserProfileData, updateProfile } from '../actions';

type ProfileState = {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl?: string | null;
    firstname: string;
    lastname: string;
};

export default function ProfileSettingsPage() {
    const [pending, start] = useTransition();
    const [status, setStatus] = useState<string | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);



    const [form, setForm] = useState<ProfileState>({
        displayName: '',
        username: '',
        bio: '',
        avatarUrl: '',
        firstname: '',
        lastname: '',
    });

    // If you want to prefill from your User endpoint, call it here.
    useEffect(() => {
        // TODO: fetch user (or pass via parent) — placeholder:
        // setForm({ displayName: user.name, username: user.username, bio: user.bio ?? '', avatarUrl: user.avatar ?? '' })
        const fetchData = async () => {
            const response = await getUserProfileData();
            setForm({
                displayName: response.data.displayName ?? '',
                username: response.data.username ?? '',
                bio: response.data.bio ?? '',
                avatarUrl: response.data.avatar ?? '',
                firstname: response.data.firstname ?? '',
                lastname: response.data.lastname ?? '',
            });
        };
        fetchData().catch(err => console.log(err));
    }, []);

    const seed = encodeURIComponent(form.username || form.displayName || 'EchoedUser');
    const generatedAvatar = `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}&size=256&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    const previewUrl =
        !imgError && (form.avatarUrl?.trim()?.length ? form.avatarUrl.trim() : generatedAvatar);


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        start(async () => {
            const res = await updateProfile(form as any);
            setStatus(res?.success ? 'Saved' : 'Failed');
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <header>
                <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500">Update your public profile information.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Firstname</label>
                    <input
                        value={form.firstname}
                        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="Your Firstname"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Lastname</label>
                    <input
                        value={form.lastname}
                        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="Your Lastname"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Display name</label>
                    <input
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="Your name"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">@username</label>
                    <input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="handle"
                        required
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Bio (markdown)</label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="Tell people about yourself…"
                    />
                </div>

                {/* <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
                    <input
                        value={form.avatarUrl ?? ''}
                        onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="https://…"
                    />
                </div> */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Avatar</label>

                    <div className="flex items-start gap-4">
                        {/* Preview */}
                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                            {!imgLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden />
                            )}
                            <img
                                src={previewUrl || ''}
                                alt="Avatar preview"
                                className="h-full w-full object-cover"
                                onLoad={() => setImgLoaded(true)}
                                onError={() => {
                                    setImgError(true);
                                    setImgLoaded(true);
                                }}
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex-1">
                            <input
                                value={form.avatarUrl ?? ''}
                                onChange={(e) => {
                                    setImgError(false);
                                    setImgLoaded(false);
                                    setForm({ ...form, avatarUrl: e.target.value });
                                }}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                placeholder="https://…"
                            />

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImgError(false);
                                        setImgLoaded(false);
                                        setForm({ ...form, avatarUrl: generatedAvatar });
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Use generated avatar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImgError(false);
                                        setImgLoaded(false);
                                        setForm({ ...form, avatarUrl: '' });
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                    Clear
                                </button>

                                <span className="text-xs text-slate-500">
                                    Leave blank to auto-generate from your username.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className={cn(
                        'rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white',
                        pending && 'opacity-70'
                    )}
                >
                    {pending ? 'Saving…' : 'Save changes'}
                </button>
                {status && <span className="text-sm text-slate-600">{status}</span>}
            </div>
        </form>
    );
}
