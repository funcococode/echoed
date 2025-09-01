'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/utils/cn';
import { changePassword, deleteAccount, signOutOtherSessions } from '../actions';

export default function AccountSettingsPage() {
    const [pending, start] = useTransition();
    const [status, setStatus] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const onChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        start(async () => {
            const res = await changePassword({ currentPassword, newPassword });
            setStatus(res?.success ? 'Password updated' : 'Failed');
            if (res?.success) {
                setCurrentPassword('');
                setNewPassword('');
            }
        });
    };

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-200">Account &amp; Security</h2>
                <p className="text-sm text-slate-500">Manage password and sessions.</p>

                <form onSubmit={onChangePassword} className="grid grid-cols-1 gap-4 sm:max-w-md">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-400">Current password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-400">New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={pending}
                            className={cn('rounded-lg bg-slate-900 dark:bg-primary px-4 py-2 text-sm font-medium text-white', pending && 'opacity-70')}
                        >
                            {pending ? 'Saving…' : 'Update password'}
                        </button>
                        {status && <span className="text-sm text-slate-600">{status}</span>}
                    </div>
                </form>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-medium text-slate-900 dark:text-neutral-200">Active sessions</h3>
                <p className="text-sm text-slate-500">You can sign out of other devices.</p>
                <button
                    onClick={() =>
                        start(async () => {
                            const res = await signOutOtherSessions();
                            setStatus(res?.success ? 'Signed out other sessions' : 'Failed');
                        })
                    }
                    className="rounded-lg border border-gray-300 bg-white dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-300 px-4 py-2 text-sm font-medium text-slate-800 dark:text-neutral-400 hover:bg-slate-50"
                >
                    Sign out of other sessions
                </button>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-medium text-slate-900 dark:text-neutral-200">Danger zone</h3>
                <p className="text-sm text-slate-500">Permanently delete your account.</p>
                <button
                    onClick={() =>
                        start(async () => {
                            if (!confirm('This will permanently delete your account. Continue?')) return;
                            const res = await deleteAccount();
                            setStatus(res?.success ? 'Account deleted' : 'Failed');
                        })
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Delete account
                </button>
            </section>
        </div>
    );
}
