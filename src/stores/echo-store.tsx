import { type PostType } from '@/actions/post';
import { create } from 'zustand'

type Store = {
    currentEcho: PostType | null,
    setCurrentEcho: (echo: PostType | null) => void
};

const useEchoStore = create<Store>((set) => ({
    currentEcho: null,
    setCurrentEcho: (echo) => set({ currentEcho: echo }),
}));

export default useEchoStore;
