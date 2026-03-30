import { IPosition } from '@/shared/types';
import { create } from 'zustand';

interface CartItem {
    position: IPosition;
    gameId: number;
}

interface CartStore {
    items: CartItem[];
    fields: Record<string, string>; // fieldId -> value
    toggle: (position: IPosition, gameId: number) => void;
    setField: (fieldId: string, value: string) => void;
    isSelected: (positionId: number) => boolean;
    total: () => number;
    clear: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    fields: {},

    toggle: (position, gameId) => {
        const exists = get().items.find((i) => i.position.id === position.id);
        if (exists) {
            set((s) => ({
                items: s.items.filter((i) => i.position.id !== position.id),
            }));
        } else {
            set((s) => ({ items: [...s.items, { position, gameId }] }));
        }
    },

    setField: (fieldId, value) => {
        set((s) => ({ fields: { ...s.fields, [fieldId]: value } }));
    },

    isSelected: (positionId) =>
        get().items.some((i) => i.position.id === positionId),

    total: () =>
        get().items.reduce(
            (acc, i) =>
                acc + Number(i.position.finalPrice ?? i.position.myPrice),
            0,
        ),

    clear: () => set({ items: [], fields: {} }),
}));
