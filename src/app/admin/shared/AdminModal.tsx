interface AdminModalProps {
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    submitLabel: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export function AdminModal({
    title,
    onClose,
    onSubmit,
    isLoading,
    submitLabel,
    disabled,
    children,
}: AdminModalProps) {
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <p className='modal__title'>{title}</p>
                {children}
                <div className='modal__footer'>
                    <button className='btn btn--ghost' onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className='btn btn--primary'
                        disabled={isLoading || disabled}
                        onClick={onSubmit}
                    >
                        {isLoading ? 'Сохраняем...' : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
