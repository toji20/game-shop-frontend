import { useCartStore } from '@/store/cart-store';
import { useEffect } from 'react';

/**
 * Подтягивает курс ЦБ напрямую с фронта (cbr-xml-daily.ru отдаёт CORS-заголовки
 * для браузерных запросов) — только для ПРИБЛИЗИТЕЛЬНОГО отображения суммы
 * пополнения до оформления заказа. Настоящая цена в рублях всегда считается
 * на бэкенде в момент оплаты (см. resolveCustomAmountPrice в order.service.ts) —
 * курс на тот момент может немного отличаться.
 *
 * Вызывай один раз на странице, где есть товар с denominationType='custom'
 * (например, страница игры Steam).
 */
export function useApproxExchangeRates() {
    const setExchangeRates = useCartStore((s) => s.setExchangeRates);

    useEffect(() => {
        let cancelled = false;

        fetch('https://www.cbr-xml-daily.ru/daily_json.js')
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;

                const usdToRub = data?.Valute?.USD?.Value;
                const kztValue = data?.Valute?.KZT?.Value;
                const kztNominal = data?.Valute?.KZT?.Nominal;

                if (typeof usdToRub !== 'number') return;

                setExchangeRates({
                    usdToRub,
                    kztToRub:
                        typeof kztValue === 'number' && kztNominal
                            ? kztValue / kztNominal
                            : 0.2,
                });
            })
            .catch(() => {
                // Тихо игнорируем — total() просто вернёт 0 для custom-товаров,
                // пока курс не подтянется (или не подтянется вовсе)
            });

        return () => {
            cancelled = true;
        };
    }, [setExchangeRates]);
}
