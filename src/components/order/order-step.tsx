interface StepProps {
    index: number;
    progress: number;
    title: string;
    desc: string;
}

export function OrderStep({ index, progress, title, desc }: StepProps) {
    const isActive = progress >= index;
    const isCurrent = Math.floor(progress) === index;
    const isHalf = progress > index - 1 && progress < index;

    return (
        <div className='order-step'>
            <div
                className={`circle ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
            >
                {isHalf ? <div className='circle-inner' /> : index}
            </div>
            <div>
                <div className='step-title'>{title}</div>
                <div className='step-desc'>{desc}</div>
            </div>
        </div>
    );
}
