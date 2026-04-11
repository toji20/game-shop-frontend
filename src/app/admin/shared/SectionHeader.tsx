interface SectionHeaderProps {
    title: string;
    count?: number;
    onAdd?: () => void;
    addLabel?: string;
}

export function SectionHeader({
    title,
    count,
    onAdd,
    addLabel = '+ Добавить',
}: SectionHeaderProps) {
    return (
        <div className='section-header'>
            <div>
                <h2 className='section-title'>{title}</h2>
                {count !== undefined && (
                    <p className='section-sub'>{count} записей</p>
                )}
            </div>
            {onAdd && (
                <button className='btn btn--primary' onClick={onAdd}>
                    {addLabel}
                </button>
            )}
        </div>
    );
}
