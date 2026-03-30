import './rating-block.css';
import { Angry, Annoyed, Smile } from 'lucide-react';

interface RatingBlockProps {
    avgRating: number | null;
    total: number;
    good: number;
    average: number;
    bad: number;
}

export function RatingBlock({
    avgRating,
    total,
    good,
    average,
    bad,
}: RatingBlockProps) {
    const avg = avgRating ?? 0;
    const ratingColor = avg >= 7 ? '#4ade80' : avg >= 4 ? '#fb923c' : '#f87171';

    const bars = [
        {
            icon: <Smile size={16} color='#4ade80' />,
            label: 'Положительные',
            count: good,
            color: '#4ade80',
        },
        {
            icon: <Annoyed size={16} color='#fb923c' />,
            label: 'Средние',
            count: average,
            color: '#fb923c',
        },
        {
            icon: <Angry size={16} color='#f87171' />,
            label: 'Отрицательные',
            count: bad,
            color: '#f87171',
        },
    ];

    return (
        <div className='rating-block'>
            <div className='rating-block__avg'>
                <div
                    className='rating-block__circle'
                    style={{ borderColor: ratingColor, color: ratingColor }}
                >
                    {avg > 0 ? avg : '—'}
                </div>
                <p className='rating-block__label'>Рейтинг игроков</p>
                <p className='rating-block__total'>{total} отзывов</p>
            </div>

            <div className='rating-block__bars'>
                {bars.map((b) => (
                    <div key={b.label} className='rating-block__bar-row'>
                        <div className='rating-block__bar-meta'>
                            {b.icon}
                            <span className='rating-block__bar-label'>
                                {b.label}
                            </span>
                            <span className='rating-block__bar-count'>
                                {b.count}
                            </span>
                        </div>
                        <div className='rating-block__bar-track'>
                            <div
                                className='rating-block__bar-fill'
                                style={{
                                    width: total
                                        ? `${(b.count / total) * 100}%`
                                        : '0%',
                                    background: b.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
