'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSettings, updateSettings } from '../actions';
import PillCheckbox from '@/components/form/checkbox-pill';
import { TbCpu, TbGridDots, TbLayout, TbLayoutBoardSplit, TbLayoutGridAdd, TbLayoutList, TbMenu3, TbMoon, TbSun, TbTextCaption } from 'react-icons/tb';
import PillRadioGroup from '@/components/form/radio-pill';

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

            <section className="grid grid-cols-1 gap-8 sm:max-w-md">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Theme</label>
                    <PillRadioGroup
                        name="theme"
                        layoutId="theme"
                        value={s?.theme}
                        onChange={(val) => patch({ theme: val as any })}
                        options={[
                            { value: 'system', label: 'System', icon: <TbCpu /> },
                            { value: 'light', label: 'Light', icon: <TbSun /> },
                            { value: 'dark', label: 'Dark', icon: <TbMoon /> },
                        ]}
                    // animate={animateReady}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Feed Density Layout</label>

                    <PillRadioGroup
                        name="feed-density-layout"
                        layoutId="feed-density-layout"
                        value={s?.feedDensity}
                        onChange={(val) => patch({ feedDensity: val as any })}
                        options={[
                            { label: 'Rows', value: 'ROWS', icon: <TbLayoutList /> },
                            { label: 'Grid', value: 'GRID', icon: <TbGridDots /> },

                        ]}
                    // animate={animateReady}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Echoes Card Layout</label>

                    <PillRadioGroup
                        name="echo-card-layout"
                        layoutId="echoes-card-layout"
                        value={s?.echoLayout}
                        onChange={(val) => patch({ echoLayout: val as any })}
                        options={[

                            { label: 'Full Size', value: 'FULL', icon: <TbLayoutBoardSplit /> },
                            { label: 'Compact', value: 'COMPACT', icon: <TbLayout /> },
                            { label: 'Slim', value: 'SLIM', icon: <TbLayoutGridAdd /> },
                            { label: 'Minimal', value: 'MINIMAL', icon: <TbTextCaption /> },
                        ]}
                    // animate={animateReady}
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
