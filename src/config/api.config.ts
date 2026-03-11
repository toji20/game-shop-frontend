export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;

export const API_URL = {
    root: (url = '') => `${url ? url : ''}`,

    // Auth
    auth: (url = '') => API_URL.root(`${SERVER_URL}/auth/${url}`),

    // Users
    users: (url = '') => API_URL.root(`${SERVER_URL}/users/${url}`),

    // Games
    game: (url = '') => API_URL.root(`${SERVER_URL}/game/${url}`),

    // Positions
    position: (url = '') => API_URL.root(`${SERVER_URL}/position/${url}`),

    // Game Fields
    gameField: (url = '') => API_URL.root(`${SERVER_URL}/game-field/${url}`),

    // Categories
    categories: (url = '') => API_URL.root(`${SERVER_URL}/categories/${url}`),

    // Banners
    banner: (url = '') => API_URL.root(`${SERVER_URL}/banner/${url}`),

    // Reviews
    reviews: (url = '') => API_URL.root(`${SERVER_URL}/reviews/${url}`),

    // Orders (AUTO + MANUAL создание + вебхук)
    orders: (url = '') => API_URL.root(`${SERVER_URL}/orders/${url}`),

    // Order API (управление заказами для сотрудников)
    orderApi: (url = '') => API_URL.root(`${SERVER_URL}/order-api/${url}`),

    // Manual Orders (ручные заказы)
    manualOrders: (url = '') =>
        API_URL.root(`${SERVER_URL}/manual-orders/${url}`),

    // Steam Orders
    steamOrders: (url = '') =>
        API_URL.root(`${SERVER_URL}/steam-orders/${url}`),

    // DonateHub (синхронизация игр)
    donatehub: (url = '') => API_URL.root(`${SERVER_URL}/donatehub/${url}`),

    // Statistics
    statistics: (url = '') => API_URL.root(`${SERVER_URL}/statistics/${url}`),

    // Files
    files: (url = '') => API_URL.root(`${SERVER_URL}/files/${url}`),
};
