// app/settings/layout.tsx
import type { ReactNode } from 'react';
import SettingsClient from './client';

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-neutral-200">Settings</h1>

            {/* Client wrapper adds nav + page transitions */}
            <SettingsClient>{children}</SettingsClient>
        </div>
    );
}
