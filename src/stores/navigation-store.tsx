import { type NavigationLinkProps } from '@/hooks/use-echo-navigation'
import { create } from 'zustand'

type Store = {
    currentPath: NavigationLinkProps,
    setCurrentPath: (path: NavigationLinkProps) => void

    isChangingPath: boolean
    setIsChangingPath: (isChanging: boolean) => void
};

const useNavigationStore = create<Store>((set) => ({
    currentPath: {
        link: '',
        title: '',
        icon: <></>,
        sectionHeading: '',
        current: true,
    },
    isChangingPath: false,

    setCurrentPath: (path) => set({ currentPath: path }),
    setIsChangingPath: (isChanging) => set({ isChangingPath: isChanging })
}));

export default useNavigationStore;
