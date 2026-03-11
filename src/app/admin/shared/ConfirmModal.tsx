interface ConfirmModalProps {
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmModal({
    title = 'Удалить запись?',
    description = 'Это действие нельзя отменить.',
    onConfirm,
    onCancel,
    isLoading,
}: ConfirmModalProps) {
    return (
        <div className='modal-overlay' onClick={onCancel}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <p className='modal__title'>{title}</p>
                <p className='modal__desc'>{description}</p>
                <div className='modal__footer'>
                    <button className='btn btn--ghost' onClick={onCancel}>
                        Отмена
                    </button>
                    <button
                        className='btn btn--danger'
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаляем...' : 'Удалить'}
                    </button>
                </div>
            </div>
        </div>
    );
}
