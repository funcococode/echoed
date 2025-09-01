'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSettings, updateSettings } from '../actions';
import { TbWorld, TbUsers, TbLock, TbMessage2, TbUserCheck, TbBan, TbEyeOff, TbMail } from 'react-icons/tb';
import PillRadioGroup from '@/components/form/radio-pill';
import PillCheckbox from '@/components/form/checkbox-pill';

type Settings = Awaited<ReturnType<typeof getSettings>>['data'];

export default function PrivacySettingsPage() {
    const [pending, start] = useTransition();
    const [s, setS] = useState<Settings | null>(null);
    // 🔑 animation is OFF until after the first real settings render
    const [animateReady, setAnimateReady] = useState(false);

    useEffect(() => {
        getSettings()
            .then((res) => setS(res.data ?? null))
            .catch(console.error);
    }, []);

    // When settings arrive, enable animations *on the next tick*
    useEffect(() => {
        if (!animateReady && s) {
            const id = setTimeout(() => setAnimateReady(true), 0);
            return () => clearTimeout(id);
        }
    }, [s, animateReady]);

    const patch = (p: Partial<Settings>) =>
        start(async () => {
            if (!s) return;
            setS({ ...s, ...p }); // optimistic
            await updateSettings(p as any);
        });

    // Optional: while s is null, render a tiny skeleton to avoid any initial jump
    if (!s) {
        return (
            <div className="space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <div className="h-5 w-40 rounded bg-gray-100" />
                        <div className="mt-2 h-4 w-64 rounded bg-gray-100" />
                    </div>
                    <div className="h-3 w-16 rounded bg-gray-100" />
                </header>
                <div className="h-9 w-full max-w-xl rounded-full bg-gray-100" />
                <div className="h-9 w-full max-w-xl rounded-full bg-gray-100" />
                <div className="flex gap-2">
                    <div className="h-9 w-56 rounded-full bg-gray-100" />
                    <div className="h-9 w-56 rounded-full bg-gray-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Privacy &amp; Safety</h2>
                    <p className="text-sm text-slate-500">Control who can see and interact with you.</p>
                </div>
                {pending && <div className="text-xs text-slate-500">Saving…</div>}
            </header>

            {/* Visibility */}
            <section className="space-y-3">
                <div className="text-sm font-medium text-slate-800">Profile visibility</div>
                <PillRadioGroup
                    name="visibility"
                    layoutId="visibility-pill-bg"
                    value={s.profileVisibility}
                    onChange={(val) => patch({ profileVisibility: val as any })}
                    options={[
                        { value: 'PUBLIC', label: 'Public', icon: <TbWorld /> },
                        { value: 'FOLLOWERS', label: 'Followers', icon: <TbUsers /> },
                        { value: 'PRIVATE', label: 'Private', icon: <TbLock /> },
                    ]}
                    animate={animateReady} // 👈 only animate after first load
                />
            </section>

            {/* Comments */}
            <section className="space-y-3">
                <div className="text-sm font-medium text-slate-800">Who can comment on my posts</div>
                <PillRadioGroup
                    name="comments"
                    layoutId="comments-pill-bg"
                    value={s.allowComments}
                    onChange={(val) => patch({ allowComments: val as any })}
                    options={[
                        { value: 'EVERYONE', label: 'Everyone', icon: <TbMessage2 /> },
                        { value: 'FOLLOWERS', label: 'Followers', icon: <TbUserCheck /> },
                        { value: 'NOBODY', label: 'Nobody', icon: <TbBan /> },
                    ]}
                    animate={animateReady}
                />
            </section>

            {/* Toggles */}
            <section className="flex flex-wrap gap-2">
                <PillCheckbox
                    id="blur-nsfw"
                    checked={!!s.blurNSFW}
                    onChange={(v) => patch({ blurNSFW: v } as any)}
                    icon={<TbEyeOff />}
                    animate={animateReady}
                >
                    Blur NSFW content
                </PillCheckbox>

                <PillCheckbox
                    id="discoverable-email"
                    checked={!!s.discoverableByEmail}
                    onChange={(v) => patch({ discoverableByEmail: v } as any)}
                    icon={<TbMail />}
                    animate={animateReady}
                >
                    Discoverable by email
                </PillCheckbox>
            </section>
        </div>
    );
}
