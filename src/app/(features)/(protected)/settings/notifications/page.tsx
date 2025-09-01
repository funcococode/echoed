'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSettings, updateSettings } from '../actions';
import PillCheckbox from '@/components/form/checkbox-pill';
import { TbAt, TbHeart, TbMail, TbMessagePlus, TbNotification, TbUserPlus } from 'react-icons/tb';

type Settings = Awaited<ReturnType<typeof getSettings>>['data'];

export default function NotificationsSettingsPage() {
    const [pending, start] = useTransition();
    const [s, setS] = useState<Settings | null>(null);

    useEffect(() => {
        getSettings().then((res) => setS(res.data ?? null)).catch(console.error);
    }, []);

    const patch = (p: Partial<Settings>) =>
        start(async () => {
            if (!s) return;
            const next = { ...s, ...p };
            setS(next);
            await updateSettings(p as any);
        });

    return (
        <div className="space-y-6">
            <header className='flex items-center justify-between'>
                <div>

                    <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-200">Notifications</h2>
                    <p className="text-sm text-slate-500">Choose what alerts you receive.</p>
                </div>
                {pending && <div className="text-xs text-slate-500">Saving…</div>}
            </header>


            <section className="space-y-2 space-x-2">
                <PillCheckbox
                    id="in-app-notifications"
                    checked={!!s?.inAppNotifications}
                    onChange={(v) => patch({ inAppNotifications: v })}
                    icon={<TbNotification />}
                >
                    In App Notifications
                </PillCheckbox>

                <PillCheckbox
                    id="email-notifications"
                    checked={!!s?.emailNotifications}
                    onChange={(v) => patch({ emailNotifications: v } as any)}
                    icon={<TbMail />}
                >
                    Email Notifications
                </PillCheckbox>
            </section>

            <h3 className="mt-2 text-sm font-medium text-slate-800 dark:text-neutral-400">Events</h3>
            <section className="space-y-2 space-x-2">
                {[
                    ['notifyNewFollower', 'New follower', <TbUserPlus key="notifyNewFollower" />],
                    ['notifyMention', 'Mentions', <TbAt key="notifyMention" />],
                    ['notifyComment', 'Comments', <TbMessagePlus key="notifyComment" />],
                    ['notifyLike', 'Likes', <TbHeart key="notifyLike" />],
                ].map(([key, label, icon]) => (

                    <PillCheckbox
                        key={key}
                        id={key}
                        checked={!!s?.[key]}
                        onChange={(v) => patch({ [key]: v })}
                        icon={icon}
                    >
                        {label}
                    </PillCheckbox>

                ))}
            </section>

        </div>
    );
}
