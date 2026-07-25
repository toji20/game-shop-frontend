import { IGiftApiProduct } from '@/shared/types/giftapi-product.interface';
import { create } from 'zustand';

interface CartItem {
    product: IGiftApiProduct;
    gameId: number;
}

interface CartStore {
    items: CartItem[];
    fields: Record<string, string>;

    toggle: (product: IGiftApiProduct, gameId: number) => void;
    setField: (fieldId: string, value: string) => void;

    isSelected: (productId: string) => boolean;

    total: () => number;

    clear: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    fields: {},

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

    isSelected: (productId) =>
        get().items.some((i) => i.product.id === productId),

    total: () =>
        get().items.reduce(
            (sum, item) => sum + Number(item.product.finalPrice),
            0,
        ),

    clear: () =>
        set({
            items: [],
            fields: {},
        }),
}));
