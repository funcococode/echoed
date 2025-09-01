'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSettings, updateSettings } from '../actions';
import PillCheckbox from '@/components/form/checkbox-pill';
import { TbLink, TbPlayerPlay } from 'react-icons/tb';
import { SelectInput } from '@/components/form/select-input';

type Settings = Awaited<ReturnType<typeof getSettings>>['data'];

export default function ContentSettingsPage() {
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

                    <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-200">Content &amp; Feed</h2>
                    <p className="text-sm text-slate-500">Tune your home feed and media behavior.</p>
                </div>
                {pending && <div className="text-xs text-slate-500">Saving…</div>}
            </header>

            <section className="grid grid-cols-1 gap-5 sm:max-w-md">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-400">Home feed style</label>
                    <SelectInput
                        options={[
                            { value: 'following', label: 'Following' },
                            { value: 'latest', label: 'Latest' },
                            { value: 'mixed', label: 'Mixed' },
                        ]}
                        onChange={(value) => patch({ feedStyle: value })}
                        placeholder='Select a feed style'
                    />
                </div>

                <section className="space-y-2 space-x-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-400">Media & Feed Settings</label>
                    <PillCheckbox
                        id="autoplay-media"
                        checked={!!s?.autoplayMedia}
                        onChange={(v) => patch({ autoplayMedia: v })}
                        icon={<TbPlayerPlay />}
                    >
                        Autoplay Media
                    </PillCheckbox>

                    <PillCheckbox
                        id="inline-link-previews"
                        checked={!!s?.inlineLinkPreviews}
                        onChange={(v) => patch({ inlineLinkPreviews: v } as any)}
                        icon={<TbLink />}
                    >
                        Inline Link Previews
                    </PillCheckbox>
                </section>
            </section>

        </div>
    );
}
