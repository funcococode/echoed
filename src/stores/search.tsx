// store/search.ts
import { create } from 'zustand';
import type { SearchDataResponse } from '@/components/ui/search/search-bar';

interface Bounds {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface SearchStore {
    query: string;
    results: SearchDataResponse[];
    searchBarBounds?: Bounds;
    setResults: (r: SearchDataResponse[]) => void;
    setQuery: (q: string) => void;
    setSearchBarBounds: (b: Bounds) => void;
    clear: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    query: '',
    results: [],
    searchBarBounds: undefined,
    setResults: (results) => set({ results }),
    setQuery: (query) => set({ query }),
    setSearchBarBounds: (bounds) => set({ searchBarBounds: bounds }),
    clear: () => set({ query: '', results: [], searchBarBounds: undefined })
}));
