import { IGiftApiProduct } from '@/shared/types/giftapi-product.interface';
import { create } from 'zustand';

interface CartItem {
    product: IGiftApiProduct;
    gameId: number;
}

interface ExchangeRates {
    usdToRub: number;
    kztToRub: number;
}

const APPROX_CUSTOM_TOPUP_COMMISSION = 1.04;

interface CartStore {
    items: CartItem[];
    fields: Record<string, string>;
    exchangeRates: ExchangeRates | null;

    toggle: (product: IGiftApiProduct, gameId: number) => void;
    setField: (fieldId: string, value: string) => void;
    setExchangeRates: (rates: ExchangeRates) => void;

    isSelected: (productId: string) => boolean;

    hasApproxPricedItem: () => boolean;

    total: () => number;

    clear: () => void;
}

function resolveApproxItemPrice(
    item: CartItem,
    fields: Record<string, string>,
    exchangeRates: ExchangeRates | null,
): number {
    const { product } = item;

    if (product.denominationType !== 'custom') {
        return Number(product.finalPrice ?? product.price ?? 0);
    }

    const fieldDefs = product.attributes?.fields ?? [];
    const amountFieldDef =
        fieldDefs.find((f) => f.code === 'amount') ??
        fieldDefs.find((f) => f.type === 'decimal');

    if (!amountFieldDef) return 0;

    const rawAmount = fields[amountFieldDef.code];
    const amount = Number(rawAmount);
    if (!rawAmount || Number.isNaN(amount)) return 0;

    if (!exchangeRates) return 0;

    let amountInRub: number;
    if (product.currency === 'USD') {
        amountInRub = amount * exchangeRates.usdToRub;
    } else if (product.currency === 'KZT') {
        amountInRub = amount * exchangeRates.kztToRub;
    } else {
        amountInRub = amount;
    }

    return +(amountInRub * APPROX_CUSTOM_TOPUP_COMMISSION).toFixed(2);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    fields: {},
    exchangeRates: null,

    // Single-select: в корзине может быть только один товар одновременно.
    // Клик по уже выбранному товару снимает выбор, клик по другому — заменяет
    // текущий выбор новым (а не добавляет вторым элементом).
    toggle: (product, gameId) => {
        const exists = get().items.find((i) => i.product.id === product.id);

        if (exists) {
            set({ items: [], fields: {} });
        } else {
            set({
                items: [{ product, gameId }],
                fields: {},
            });
        }
    },
    setField: (fieldId, value) => {
        set((state) => ({
            fields: {
                ...state.fields,
                [fieldId]: value,
            },
        }));
    },

    setExchangeRates: (exchangeRates) => set({ exchangeRates }),

    isSelected: (productId) =>
        get().items.some((i) => i.product.id === productId),

    hasApproxPricedItem: () =>
        get().items.some((i) => i.product.denominationType === 'custom'),

    total: () => {
        const { items, fields, exchangeRates } = get();
        return items.reduce(
            (sum, item) =>
                sum + resolveApproxItemPrice(item, fields, exchangeRates),
            0,
        );
    },

    clear: () =>
        set({
            items: [],
            fields: {},
        }),
}));
