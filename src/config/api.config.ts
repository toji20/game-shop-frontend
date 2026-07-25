export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;

export const API_URL = {
    root: (url = '') => `${url ? url : ''}`,

    // Auth
    auth: (url = '') => API_URL.root(`${SERVER_URL}/auth/${url}`),

    // Users
    users: (url = '') => API_URL.root(`${SERVER_URL}/users/${url}`),

    // Avatars
    avatar: (url = '') => API_URL.root(`${SERVER_URL}/avatar/${url}`),

    // Games
    game: (url = '') => API_URL.root(`${SERVER_URL}/game/${url}`),

    // GiftAPI Products (CRUD-сущность GiftApiProduct в нашей БД)
    giftApiProducts: (url = '') =>
        API_URL.root(`${SERVER_URL}/giftapi/products/${url}`),

    // GiftAPI Catalog (синхронизация и выборки из GiftapiCatalogController)
    // GET /giftapi/categories -> список категорий
    giftApiCategories: () => API_URL.root(`${SERVER_URL}/giftapi/categories`),
    // GET /giftapi/category/:category -> товары по категории (напр. "Game Top-Ups")
    giftApiCategory: (category = '') =>
        API_URL.root(`${SERVER_URL}/giftapi/category/${category}`),
    // GET /giftapi/type/:type -> товары по типу
    giftApiType: (type = '') =>
        API_URL.root(`${SERVER_URL}/giftapi/type/${type}`),
    // GET /giftapi/sku/:skuId -> товар по SKU
    giftApiSku: (skuId = '') =>
        API_URL.root(`${SERVER_URL}/giftapi/sku/${skuId}`),
    // GET /giftapi/pricelist
    giftApiPricelist: () => API_URL.root(`${SERVER_URL}/giftapi/pricelist`),
    // POST /giftapi/sync
    giftApiSync: () => API_URL.root(`${SERVER_URL}/giftapi/sync`),

    // Positions
    position: (url = '') => API_URL.root(`${SERVER_URL}/position/${url}`),

    positionCategory: (string = '') =>
        `${SERVER_URL}/position-category/${string}`,

    // Game Fields
    gameField: (url = '') => API_URL.root(`${SERVER_URL}/game-field/${url}`),

    // Categories
    categories: (url = '') => API_URL.root(`${SERVER_URL}/categories/${url}`),

    // Banners
    banner: (url = '') => API_URL.root(`${SERVER_URL}/banner/${url}`),

    sideBanner: (url = '') => API_URL.root(`${SERVER_URL}/sideBanner/${url}`),

    adBanner: (url = '') => API_URL.root(`${SERVER_URL}/ad-banner/${url}`),

    // Reviews
    reviews: (url = '') => API_URL.root(`${SERVER_URL}/reviews/${url}`),

    // Orders (AUTO + MANUAL создание + вебхук)
    orders: (url = '') => API_URL.root(`${SERVER_URL}/orders/${url}`),

    // Order API (управление заказами для сотрудников)
    orderApi: (url = '') => API_URL.root(`${SERVER_URL}/order-api/${url}`),

    // Manual Orders
    manualOrders: (url = '') =>
        API_URL.root(`${SERVER_URL}/manual-orders/${url}`),

    // Steam Orders
    steamOrders: (url = '') =>
        API_URL.root(`${SERVER_URL}/steam-orders/${url}`),

    // DonateHub
    donatehub: (url = '') => API_URL.root(`${SERVER_URL}/donatehub/${url}`),

    // Statistics
    statistics: (url = '') => API_URL.root(`${SERVER_URL}/statistics/${url}`),

    // Files
    files: (url = '') => API_URL.root(`${SERVER_URL}/files/${url}`),

    // Promo
    promo: (url = '') =>
        API_URL.root(`${SERVER_URL}/promo${url ? `/${url}` : ''}`),
};
