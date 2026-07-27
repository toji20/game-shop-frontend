import { create } from 'zustand';

interface SteamTopupState {
    login: string;
    amount: string;
    currency: 'RUB' | 'KZT';
    setLogin: (v: string) => void;
    setAmount: (v: string) => void;
    setCurrency: (v: 'RUB' | 'KZT') => void;
    addAmount: (delta: number) => void;
    reset: () => void;
}

export const useSteamTopupStore = create<SteamTopupState>((set) => ({
    login: '',
    amount: '',
    currency: 'RUB',
    setLogin: (login) => set({ login }),
    setAmount: (amount) => set({ amount }),
    setCurrency: (currency) => set({ currency }),
    addAmount: (delta) =>
        set((s) => ({
            amount: String(Math.max(0, (Number(s.amount) || 0) + delta)),
        })),
    reset: () => set({ login: '', amount: '', currency: 'RUB' }),
}));
