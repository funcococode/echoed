'use client';

import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/utils/cn';
import { updateProfile } from '../actions';

type ProfileState = {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl?: string | null;
};

export default function ProfileSettingsPage() {
    const [pending, start] = useTransition();
    const [status, setStatus] = useState<string | null>(null);
    const [form, setForm] = useState<ProfileState>({
        displayName: '',
        username: '',
        bio: '',
        avatarUrl: '',
    });

    // If you want to prefill from your User endpoint, call it here.
    useEffect(() => {
        // TODO: fetch user (or pass via parent) — placeholder:
        // setForm({ displayName: user.name, username: user.username, bio: user.bio ?? '', avatarUrl: user.avatar ?? '' })
    }, []);

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

                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
                    <input
                        value={form.avatarUrl ?? ''}
                        onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        placeholder="https://…"
                    />
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
