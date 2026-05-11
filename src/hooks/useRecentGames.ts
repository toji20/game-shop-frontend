/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useGamesActive } from '@/hooks/queries/useGame';
import { IGame } from '@/shared/types';
import { useEffect, useState } from 'react';

const STORAGE_KEY_PREFIX = 'field_history_';
const MAX_RECENT = 6;

function getRecentGameIds(): number[] {
    if (typeof window === 'undefined') return [];

    const ids: number[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(STORAGE_KEY_PREFIX)) continue;

        const raw = key.slice(STORAGE_KEY_PREFIX.length);
        const id = parseInt(raw, 10);
        if (!isNaN(id)) ids.push(id);
    }

    return ids.slice(0, MAX_RECENT);
}

export function useRecentGames(): { recentGames: IGame[] | null } {
    const { activeGames } = useGamesActive();
    const [recentIds, setRecentIds] = useState<number[]>([]);

    useEffect(() => {
        setRecentIds(getRecentGameIds());
    }, []);

    if (!activeGames || recentIds.length === 0) return { recentGames: null };

    const recentGames = recentIds
        .map((id) => activeGames.find((g) => g.id === id))
        .filter((g): g is IGame => !!g);

    return { recentGames: recentGames.length > 0 ? recentGames : null };
}
