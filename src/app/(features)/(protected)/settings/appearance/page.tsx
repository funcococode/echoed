'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSettings, updateSettings } from '../actions';
import PillCheckbox from '@/components/form/checkbox-pill';
import { TbMenu3 } from 'react-icons/tb';
import { SelectInput } from '@/components/form/select-input';

type Settings = Awaited<ReturnType<typeof getSettings>>['data'];

export default function AppearanceSettingsPage() {
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
                    <h2 className="text-lg font-semibold text-slate-900">Appearance &amp; Accessibility</h2>
                    <p className="text-sm text-slate-500">Personalize how Echoed looks and feels.</p>
                </div>
                {pending && <div className="text-xs text-slate-500">Saving…</div>}
            </header>

            <section className="grid grid-cols-1 gap-4 sm:max-w-md">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Theme</label>
                    <SelectInput
                        options={[
                            { value: 'SYSTEM', label: 'System' },
                            { value: 'LIGHT', label: 'Light' },
                            { value: 'DARK', label: 'Dark' },
                        ]}
                        onChange={(value) => patch({ theme: value })}
                        placeholder='Select a theme'
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Density</label>
                    <SelectInput
                        options={[
                            { value: 'cozy', label: 'Cozy' },
                            { value: 'compact', label: 'Compact' },
                        ]}
                        onChange={(value) => patch({ density: value })}
                        placeholder='Select a density'
                    />
                </div>

            </section>
            <section>
                <label className="mb-1 block text-sm font-medium text-slate-700">Miscellaneous</label>
                <PillCheckbox
                    id="reduce-motion"
                    checked={!!s?.reduceMotion}
                    onChange={(v) => patch({ reduceMotion: v })}
                    icon={<TbMenu3 />}
                >
                    Reduce Motion
                </PillCheckbox>
            </section>

        </div>
    );
}
