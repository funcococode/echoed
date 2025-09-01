import { type Layout, type PostLayout } from '@/types/layout';
import { create } from 'zustand'

type Store = {
    layout: Layout | null,
    setLayout: (value: Layout | null) => void
    echoLayout: PostLayout | null
    setEchoLayout: (value: PostLayout | null) => void

    theme: 'dark' | 'light' | 'system' | null;
    setTheme: (value: 'dark' | 'light' | 'system' | null) => void;
};

const useLayoutStore = create<Store>((set) => ({
    layout: 'ROWS',
    setLayout: (value) => set({ layout: value }),
    echoLayout: 'SLIM',
    setEchoLayout: (value) => set({ echoLayout: value }),

    theme: 'system',
    setTheme: (value) => set({ theme: value }),
}));

export default useLayoutStore;
