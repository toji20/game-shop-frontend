import { create } from 'zustand';

type Currency = 'RUB' | 'USD' | 'KZT';
type SteamPaymentMethod = 'bank_card' | 'sbp';

interface SteamCheckResult {
    totalRubBase: number;
    totalRubCard: number;
    totalRubSbp: number;
    originalAmount: number;
    currency: Currency;
}

interface SteamState {
    account: string;
    amount: number;
    currency: Currency;
    paymentMethod: SteamPaymentMethod;
    promoCode: string;
    checkResult: SteamCheckResult | null;

    setAccount: (v: string) => void;
    setAmount: (v: number) => void;
    setCurrency: (v: Currency) => void;
    setPaymentMethod: (v: SteamPaymentMethod) => void;
    setPromoCode: (v: string) => void;
    setCheckResult: (v: SteamCheckResult | null) => void;
}

export const useSteamStore = create<SteamState>((set) => ({
    account: '',
    amount: 100,
    currency: 'RUB',
    paymentMethod: 'bank_card',
    promoCode: '',
    checkResult: null,

    setAccount: (account) => set({ account }),
    setAmount: (amount) => set({ amount, checkResult: null }),
    setCurrency: (currency) => set({ currency, checkResult: null }),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setPromoCode: (promoCode) => set({ promoCode, checkResult: null }),
    setCheckResult: (checkResult) => set({ checkResult }),
}));
