// ─── Главная статистика (GET /statistics/main) ───────────────────────────────

export interface IStatisticCard {
  id: number
  name: string
  value: number
}

// ─── Детальная статистика (GET /statistics/detailed) ─────────────────────────

export interface IMonthlySaleItem {
  date: string  // "15 фев"
  value: number
}

export interface ITopGame {
  gameId: number
  name: string
  image: string | null
  ordersCount: number
  revenue: number
}

export interface ILastUser {
  id: string
  name: string
  email: string
  picture: string
  totalSpent: number
}

export interface IDetailedStatistics {
  monthlySales: IMonthlySaleItem[]
  topGames: ITopGame[]
  lastUsers: ILastUser[]
}
