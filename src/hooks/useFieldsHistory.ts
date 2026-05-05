// hooks/useFieldHistory.ts
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'field_history';
const MAX_PER_FIELD = 3;

type FieldHistory = Record<string, string[]>;

export function useFieldHistory(gameId: number) {
    const storageKey = `${STORAGE_KEY}_${gameId}`;
    const [history, setHistory] = useState<FieldHistory>({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (raw) setHistory(JSON.parse(raw));
        } catch {}
    }, [storageKey]);

    const saveFields = (
        fields: Record<string, string>,
        gameFields: { id: number; label: string }[],
    ) => {
        try {
            const raw = localStorage.getItem(storageKey);
            const current: FieldHistory = raw ? JSON.parse(raw) : {};

            gameFields.forEach((f) => {
                const value = fields[String(f.id)]?.trim();
                if (!value) return;

                const existing = current[f.label] ?? [];
                const updated = [
                    value,
                    ...existing.filter((v) => v !== value),
                ].slice(0, MAX_PER_FIELD);
                current[f.label] = updated;
            });

            localStorage.setItem(storageKey, JSON.stringify(current));
            setHistory(current);
        } catch {}
    };

    return { history, saveFields };
}
