import { create } from 'zustand';

type Currency = 'RUB' | 'USD' | 'KZT';

interface SteamState {
    account: string;
    amount: number;
    currency: Currency;

    setAccount: (v: string) => void;
    setAmount: (v: number) => void;
    setCurrency: (v: Currency) => void;
}

export const useSteamStore = create<SteamState>((set) => ({
    account: '',
    amount: 100,
    currency: 'RUB',

    setAccount: (account) => set({ account }),
    setAmount: (amount) => set({ amount }),
    setCurrency: (currency) => set({ currency }),
}));
