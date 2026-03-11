'use client';

import { IMonthlySaleItem } from '@/shared/types';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className='chart-tooltip'>
            <p className='chart-tooltip__date'>{label}</p>
            <p className='chart-tooltip__value'>
                {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 0,
                }).format(payload[0].value)}
            </p>
        </div>
    );
}

interface RevenueChartProps {
    data: IMonthlySaleItem[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className='chart-wrapper'>
            <h2 className='chart-title'>Выручка за 30 дней</h2>
            <ResponsiveContainer width='100%' height={280}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id='revenueGradient'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                            <stop
                                offset='0%'
                                stopColor='#6366f1'
                                stopOpacity={0.35}
                            />
                            <stop
                                offset='100%'
                                stopColor='#6366f1'
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='rgba(255,255,255,0.06)'
                    />
                    <XAxis
                        dataKey='date'
                        tick={{
                            fill: '#94a3b8',
                            fontSize: 11,
                            fontFamily: 'inherit',
                        }}
                        axisLine={false}
                        tickLine={false}
                        interval={4}
                    />
                    <YAxis
                        tick={{
                            fill: '#94a3b8',
                            fontSize: 11,
                            fontFamily: 'inherit',
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type='monotone'
                        dataKey='value'
                        stroke='#6366f1'
                        strokeWidth={2.5}
                        fill='url(#revenueGradient)'
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: '#6366f1',
                            stroke: '#fff',
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
