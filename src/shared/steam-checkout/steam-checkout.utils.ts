import {
    IGiftApiField,
    IGiftApiProduct,
} from '@/shared/types/giftapi-product.interface';

export function getProductForCurrency(
    products: IGiftApiProduct[],
    currency: 'RUB' | 'KZT',
): IGiftApiProduct | undefined {
    return products.find((p) => p.currency === currency) ?? products[0];
}

export function getAmountField(
    product?: IGiftApiProduct,
): IGiftApiField | undefined {
    const fields = product?.attributes?.fields ?? [];
    return (
        fields.find((f) => f.code === 'amount') ??
        fields.find((f) => f.type === 'decimal')
    );
}

// TODO: если код поля логина в GiftAPI не 'login', а что-то другое —
// проверьте фактические attributes.fields товара в консоли/бэкенде.
export function getLoginField(
    product?: IGiftApiProduct,
): IGiftApiField | undefined {
    const fields = product?.attributes?.fields ?? [];
    const amountCode = getAmountField(product)?.code;
    return fields.find((f) => f.code !== amountCode);
}
