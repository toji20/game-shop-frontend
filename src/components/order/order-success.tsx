import Link from 'next/link';

export function OrderSuccess() {
    return (
        <div className='order-status__success'>
            <p className='order-status__success-title'>Спасибо за покупку!</p>
            <p className='order-status__success-desc'>
                Ваш заказ успешно выполнен
            </p>
            <Link href='/' className='order-status__home-btn'>
                На главную
            </Link>
        </div>
    );
}
