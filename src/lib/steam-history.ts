const STEAM_ACCOUNT_HISTORY_KEY = 'steam_account_history';
const MAX_ACCOUNTS = 3;

export function loadAccountHistory(): string[] {
    try {
        const raw = localStorage.getItem(STEAM_ACCOUNT_HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveAccountHistory(account: string) {
    try {
        const existing = loadAccountHistory();
        const updated = [
            account,
            ...existing.filter((a) => a !== account),
        ].slice(0, MAX_ACCOUNTS);
        localStorage.setItem(
            STEAM_ACCOUNT_HISTORY_KEY,
            JSON.stringify(updated),
        );
    } catch {}
}
