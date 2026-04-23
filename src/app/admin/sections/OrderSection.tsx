'use client';

import {
    useAnyOrderById,
    useUpdateOrderStatus,
    useUpdateManualStatus,
    useUpdateSteamOrderStatus,
    useUpdateOrderItemDonateHubStatus,
    useUpdateSteamDonateHubStatus,
} from '@/hooks/queries/useOrder';
import { IOrder, ISteamOrder } from '@/shared/types';
import {
    ManualStatus,
    DonateHubStatus,
    OrderStatus,
} from '@/shared/types/order.interface';
import {
    Search,
    Loader2,
    Check,
    Clock,
    Zap,
    Truck,
    XCircle,
    KeyRound,
} from 'lucide-react';
import { useState } from 'react';

type StatusConfig = {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
};

const PAYMENT_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    PENDING: {
        label: 'Ожидает оплату',
        color: '#92400e',
        bg: '#fef3c7',
        icon: <Clock size={10} />,
    },
    PAID: {
        label: 'Оплачен',
        color: '#1e40af',
        bg: '#dbeafe',
        icon: <Check size={10} />,
    },
    IN_PROCESS: {
        label: 'В процессе',
        color: '#5b21b6',
        bg: '#ede9fe',
        icon: <Loader2 size={10} />,
    },
    COMPLETED: {
        label: 'Выполнен',
        color: '#065f46',
        bg: '#d1fae5',
        icon: <Check size={10} />,
    },
    CANCELED: {
        label: 'Отменён',
        color: '#991b1b',
        bg: '#fee2e2',
        icon: <XCircle size={10} />,
    },
};

const MANUAL_STATUS_CONFIG: Record<ManualStatus, StatusConfig> = {
    PENDING: {
        label: 'В очереди',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    ASSIGNED: {
        label: 'Назначен',
        color: '#fff',
        bg: '#2563eb',
        icon: <Zap size={10} />,
    },
    AWAITING_2FA: {
        label: 'Ждёт код',
        color: '#fff',
        bg: '#ea580c',
        icon: <KeyRound size={10} />,
    },
    IN_PROGRESS: {
        label: 'В процессе',
        color: '#fff',
        bg: '#7c3aed',
        icon: <Loader2 size={10} />,
    },
    COMPLETED: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
    },
    FAILED: {
        label: 'Ошибка',
        color: '#fff',
        bg: '#dc2626',
        icon: <XCircle size={10} />,
    },
};

const DONATEHUB_STATUS_CONFIG: Record<DonateHubStatus, StatusConfig> = {
    WAIT: {
        label: 'Ожидание',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    IN_QUEUE: {
        label: 'В очереди',
        color: '#fff',
        bg: '#2563eb',
        icon: <Loader2 size={10} />,
    },
    PROGRESS: {
        label: 'В процессе',
        color: '#fff',
        bg: '#7c3aed',
        icon: <Truck size={10} />,
    },
    SUCCESS: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
    },
    FAILED: {
        label: 'Ошибка',
        color: '#fff',
        bg: '#dc2626',
        icon: <XCircle size={10} />,
    },
};

const ORDER_STATUSES: OrderStatus[] = [
    'PENDING',
    'PAID',
    'IN_PROCESS',
    'COMPLETED',
    'CANCELED',
];

const MANUAL_STATUSES: ManualStatus[] = [
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
    'AWAITING_2FA',
    'COMPLETED',
    'FAILED',
];

const DONATEHUB_STATUSES: DonateHubStatus[] = [
    'WAIT',
    'IN_QUEUE',
    'PROGRESS',
    'SUCCESS',
    'FAILED',
];

export default function OrdersSection() {
    const [inputId, setInputId] = useState('');
    const [searchId, setSearchId] = useState('');

    const { order, isLoading } = useAnyOrderById(searchId);

    const handleSearch = () => {
        if (inputId.trim()) setSearchId(inputId.trim());
    };

    const notFound = searchId && !isLoading && !order;

    return (
        <div>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Поиск заказа</h2>
                    <p className='section-sub'>
                        Введите ID заказа — обычного или Steam
                    </p>
                </div>
            </div>

            <div className='orders-search'>
                <input
                    className='form-input orders-search__input'
                    placeholder='ID заказа...'
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    className='btn btn--primary orders-search__btn'
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 size={15} className='orders-search__spinner' />
                    ) : (
                        <Search size={15} />
                    )}
                    Найти
                </button>
            </div>

            {notFound && <p className='orders-not-found'>Заказ не найден</p>}

            {order?.type === 'order' && <OrderDetail order={order.data} />}
            {order?.type === 'steam' && <SteamOrderDetail order={order.data} />}
        </div>
    );
}

function OrderDetail({ order }: { order: IOrder }) {
    const { updateOrderStatus, isLoadingUpdate } = useUpdateOrderStatus(
        order.id,
    );
    const { updateStatus: updateManual, isLoadingUpdate: isLoadingManual } =
        useUpdateManualStatus(order.id);
    const { updateDonateHubStatus, isLoadingUpdate: isLoadingDonateHubUpdate } =
        useUpdateOrderItemDonateHubStatus(order.id);

    const shouldShowDonateHubControls = order.type !== 'MANUAL';

    return (
        <div className='order-detail'>
            <div className='admin-card order-detail__header'>
                <div className='order-detail__meta'>
                    <div className='order-detail__badges'>
                        <span className='order-detail__id'>
                            #{order.id.slice(-10).toUpperCase()}
                        </span>
                        <span className='badge badge--yellow'>
                            {order.type}
                        </span>
                        <StatusBadge
                            config={PAYMENT_STATUS_CONFIG[order.status]}
                        />
                        {order.manualStatus && (
                            <StatusBadge
                                config={
                                    MANUAL_STATUS_CONFIG[order.manualStatus]
                                }
                            />
                        )}
                    </div>
                    <p className='order-detail__sub'>
                        {order.user?.email ?? 'Гость'} ·{' '}
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </p>
                </div>
                <div className='order-detail__total'>
                    {Number(order.total).toFixed(2)} ₽
                </div>
            </div>

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>Позиция</th>
                            <th>Игра</th>
                            <th>Кол-во</th>
                            <th>Цена</th>
                            <th>DonateHub</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item) => (
                            <tr key={item.id}>
                                <td className='td-main'>
                                    {item.position?.name ?? '—'}
                                </td>
                                <td className='td-muted'>
                                    {item.game?.name ?? '—'}
                                </td>
                                <td>{item.quantity}</td>
                                <td className='td-price'>
                                    {Number(item.price).toFixed(2)} ₽
                                </td>
                                <td>
                                    {item.donateHubStatus ? (
                                        <StatusBadge
                                            config={
                                                DONATEHUB_STATUS_CONFIG[
                                                    item.donateHubStatus
                                                ]
                                            }
                                        />
                                    ) : (
                                        '—'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {order.twoFaCode && (
                <div className='admin-card order-2fa'>
                    <p className='order-2fa__label'>2FA код</p>
                    <code className='order-2fa__code'>{order.twoFaCode}</code>
                </div>
            )}

            <div className='order-detail__controls'>
                <div className='admin-card order-status-panel'>
                    <p className='order-status-panel__label'>Статус оплаты</p>
                    <div className='order-status-panel__btns'>
                        {ORDER_STATUSES.map((status) => {
                            const config = PAYMENT_STATUS_CONFIG[status];
                            return (
                                <StatusActionButton
                                    key={status}
                                    config={config}
                                    isActive={order.status === status}
                                    disabled={
                                        isLoadingUpdate ||
                                        order.status === status
                                    }
                                    onClick={() => updateOrderStatus(status)}
                                />
                            );
                        })}
                    </div>
                </div>

                {order.type === 'MANUAL' && (
                    <div className='admin-card order-status-panel'>
                        <p className='order-status-panel__label'>
                            Ручной статус
                        </p>
                        <div className='order-status-panel__btns'>
                            {MANUAL_STATUSES.map((status) => {
                                const config = MANUAL_STATUS_CONFIG[status];
                                return (
                                    <StatusActionButton
                                        key={status}
                                        config={config}
                                        isActive={order.manualStatus === status}
                                        disabled={
                                            isLoadingManual ||
                                            order.manualStatus === status
                                        }
                                        onClick={() => updateManual({ status })}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {shouldShowDonateHubControls &&
                    order.items.map((item) => (
                        <div
                            key={item.id}
                            className='admin-card order-status-panel'
                        >
                            <p className='order-status-panel__label'>
                                DonateHub: {item.position?.name ?? item.id}
                            </p>
                            <div className='order-status-panel__btns'>
                                {DONATEHUB_STATUSES.map((status) => {
                                    const config =
                                        DONATEHUB_STATUS_CONFIG[status];
                                    return (
                                        <StatusActionButton
                                            key={status}
                                            config={config}
                                            isActive={
                                                item.donateHubStatus === status
                                            }
                                            disabled={
                                                isLoadingDonateHubUpdate ||
                                                item.donateHubStatus === status
                                            }
                                            onClick={() =>
                                                updateDonateHubStatus({
                                                    itemId: item.id,
                                                    status,
                                                })
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

function SteamOrderDetail({ order }: { order: ISteamOrder }) {
    const { updateSteamStatus, isLoadingUpdate } = useUpdateSteamOrderStatus(
        order.id,
    );
    const {
        updateSteamDonateHubStatus,
        isLoadingUpdate: isLoadingDonateHubUpdate,
    } = useUpdateSteamDonateHubStatus(order.id);

    return (
        <div className='order-detail'>
            <div className='admin-card order-detail__header'>
                <div className='order-detail__meta'>
                    <div className='order-detail__badges'>
                        <span className='order-detail__id'>
                            #{order.id.slice(-10).toUpperCase()}
                        </span>
                        <span className='badge badge--yellow'>STEAM</span>
                        <StatusBadge
                            config={PAYMENT_STATUS_CONFIG[order.status]}
                        />
                        {order.donateHubStatus && (
                            <StatusBadge
                                config={
                                    DONATEHUB_STATUS_CONFIG[
                                        order.donateHubStatus
                                    ]
                                }
                            />
                        )}
                    </div>
                    <p className='order-detail__sub'>
                        {order.user?.email ?? 'Гость'} ·{' '}
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </p>
                    <p className='order-detail__sub'>
                        Аккаунт:{' '}
                        <strong className='order-detail__account'>
                            {order.account}
                        </strong>
                    </p>
                </div>
                <div className='order-detail__total'>
                    {Number(order.total).toFixed(2)} ₽
                </div>
            </div>

            {order.donateHubError && (
                <div className='order-detail__error'>
                    Ошибка DonateHub: {order.donateHubError}
                </div>
            )}

            <div className='order-detail__controls'>
                <div className='admin-card order-status-panel'>
                    <p className='order-status-panel__label'>Статус оплаты</p>
                    <div className='order-status-panel__btns'>
                        {ORDER_STATUSES.map((status) => {
                            const config = PAYMENT_STATUS_CONFIG[status];
                            return (
                                <StatusActionButton
                                    key={status}
                                    config={config}
                                    isActive={order.status === status}
                                    disabled={
                                        isLoadingUpdate ||
                                        order.status === status
                                    }
                                    onClick={() => updateSteamStatus(status)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className='admin-card order-status-panel'>
                    <p className='order-status-panel__label'>
                        Статус DonateHub
                    </p>
                    <div className='order-status-panel__btns'>
                        {DONATEHUB_STATUSES.map((status) => {
                            const config = DONATEHUB_STATUS_CONFIG[status];
                            return (
                                <StatusActionButton
                                    key={status}
                                    config={config}
                                    isActive={order.donateHubStatus === status}
                                    disabled={
                                        isLoadingDonateHubUpdate ||
                                        order.donateHubStatus === status
                                    }
                                    onClick={() =>
                                        updateSteamDonateHubStatus(status)
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ config }: { config: StatusConfig }) {
    return (
        <span
            className='badge'
            style={{
                background: config.bg,
                color: config.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
            }}
        >
            {config.icon}
            {config.label}
        </span>
    );
}

function StatusActionButton({
    config,
    isActive,
    disabled,
    onClick,
}: {
    config: StatusConfig;
    isActive: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type='button'
            className={`btn btn--sm ${isActive ? 'btn--primary' : 'btn--ghost'}`}
            onClick={onClick}
            disabled={disabled}
            style={
                isActive
                    ? {
                          background: config.bg,
                          color: config.color,
                          borderColor: config.bg,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                      }
                    : {
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                      }
            }
        >
            {config.icon}
            {config.label}
        </button>
    );
}
