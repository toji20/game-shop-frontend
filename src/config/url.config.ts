export const APP_URL = process.env.APP_URL as string;

// ─── Публичные страницы (для пользователей) ──────────────────────────────────
export const PUBLIC_URL = {
    root: (url = '') => `${url ? url : ''}`,

    home: () => PUBLIC_URL.root('/'),
    auth: () => PUBLIC_URL.root('/auth'),

    // Страница игры
    game: (slug: string) => PUBLIC_URL.root(`/game/${slug}`),

    games: () => PUBLIC_URL.root(`/games`),

    support: () => PUBLIC_URL.root(`/support`),

    reviews: () => PUBLIC_URL.root(`/reviews`),

    // Страница категории
    category: (id: string) => PUBLIC_URL.root(`/category/${id}`),

    // Корзина и оплата
    cart: () => PUBLIC_URL.root('/cart'),
    thanks: () => PUBLIC_URL.root('/thanks'),

    // Steam пополнение
    steam: () => PUBLIC_URL.root('/steam'),

    // Профиль пользователя
    profile: () => PUBLIC_URL.root('/profile'),
    orders: () => PUBLIC_URL.root('/profile/orders'),
    favorites: () => PUBLIC_URL.root('/profile/favorites'),
};

// ─── Дашборд (для сотрудников и администраторов) ─────────────────────────────
export const DASHBOARD_URL = {
    root: (url = '') => `/dashboard${url ? url : ''}`,

    home: () => DASHBOARD_URL.root('/'),

    // Статистика (только ADMIN)
    statistics: () => DASHBOARD_URL.root('/statistics'),

    // Управление играми
    games: () => DASHBOARD_URL.root('/games'),
    gamesCreate: () => DASHBOARD_URL.root('/games/create'),
    gamesEdit: (id: number | string) => DASHBOARD_URL.root(`/games/${id}`),

    // Позиции
    positions: (gameId: number | string) =>
        DASHBOARD_URL.root(`/games/${gameId}/positions`),
    positionsCreate: (gameId: number | string) =>
        DASHBOARD_URL.root(`/games/${gameId}/positions/create`),
    positionsEdit: (gameId: number | string, id: number | string) =>
        DASHBOARD_URL.root(`/games/${gameId}/positions/${id}`),

    // Категории
    categories: () => DASHBOARD_URL.root('/categories'),
    categoryCreate: () => DASHBOARD_URL.root('/categories/create'),
    categoryEdit: (id: string) => DASHBOARD_URL.root(`/categories/${id}`),

    // Баннеры
    banners: () => DASHBOARD_URL.root('/banners'),
    bannerCreate: () => DASHBOARD_URL.root('/banners/create'),
    bannerEdit: (id: number | string) => DASHBOARD_URL.root(`/banners/${id}`),

    // Заказы
    orders: () => DASHBOARD_URL.root('/orders'),
    orderById: (id: string) => DASHBOARD_URL.root(`/orders/${id}`),

    // Ручные заказы (для операторов)
    manualOrders: () => DASHBOARD_URL.root('/manual-orders'),
    manualOrderById: (id: string) => DASHBOARD_URL.root(`/manual-orders/${id}`),
    manualOrder: (id: string) => `/dashboard/manual-orders/${id}`,

    // Отзывы
    reviews: () => DASHBOARD_URL.root('/reviews'),

    // Синхронизация DonateHub
    sync: () => DASHBOARD_URL.root('/sync'),

    // Пользователи
    users: () => DASHBOARD_URL.root('/users'),
    userById: (id: string) => DASHBOARD_URL.root(`/users/${id}`),

    gamePositions: (id: number) => `/dashboard/games/${id}/positions`,
    gameFields: (id: number) => `/dashboard/games/${id}/fields`,
};
