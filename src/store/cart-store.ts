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

// Та же комиссия, что и на бэкенде (GIFTAPI_CUSTOM_TOPUP_COMMISSION,
// см. order.service.ts/resolveCustomAmountPrice) — здесь используется только
// для ПРИБЛИЗИТЕЛЬНОГО отображения суммы на фронте. Точная цена всегда
// пересчитывается на бэкенде в момент оформления заказа.
const APPROX_CUSTOM_TOPUP_COMMISSION = 1.04;

interface CartStore {
    items: CartItem[];
    fields: Record<string, string>;
    exchangeRates: ExchangeRates | null;

    toggle: (product: IGiftApiProduct, gameId: number) => void;
    setField: (fieldId: string, value: string) => void;
    setExchangeRates: (rates: ExchangeRates) => void;

    isSelected: (productId: string) => boolean;

    // Приблизительная сумма для товаров с denominationType='custom' (например,
    // пополнение Steam на произвольную сумму) не входит в hasApproxPricedItem —
    // используется, чтобы решить, показывать ли пометку "ориентировочно" рядом
    // с итоговой суммой.
    hasApproxPricedItem: () => boolean;

    total: () => number;

    clear: () => void;
}

/**
 * Цена одной позиции в рублях.
 * - Обычный товар (фиксированная цена в каталоге) — берём finalPrice как есть.
 * - Товар с denominationType='custom' (сумма вводится пользователем, в
 *   каталоге цены нет) — считаем ПРИБЛИЗИТЕЛЬНО: сумма × курс валюты товара
 *   → RUB × комиссия. Настоящая цена в рублях всегда определяется на
 *   бэкенде при создании платежа (курс на тот момент может отличаться).
 */
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

    if (!exchangeRates) return 0; // курс ещё не загрузился — покажем чуть позже

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

    toggle: (product, gameId) => {
        const exists = get().items.find((i) => i.product.id === product.id);

        if (exists) {
            set((state) => ({
                items: state.items.filter((i) => i.product.id !== product.id),
            }));
        } else {
            set((state) => ({
                items: [
                    ...state.items,
                    {
                        product,
                        gameId,
                    },
                ],
            }));
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
