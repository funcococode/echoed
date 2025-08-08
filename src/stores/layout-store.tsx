import { type Layout, type PostLayout } from '@/types/layout';
import { create } from 'zustand'

type Store = {
    layout: Layout | null,
    setLayout: (value: Layout | null) => void
    echoLayout: PostLayout | null
    setEchoLayout: (value: PostLayout | null) => void
};

const useLayoutStore = create<Store>((set) => ({
    layout: 'rows',
    setLayout: (value) => set({ layout: value }),
    echoLayout: 'slim',
    setEchoLayout: (value) => set({ echoLayout: value }),
}));

export default useLayoutStore;
