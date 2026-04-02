import { useState } from 'react';

interface Order2FAProps {
    onSendCode: (code: string) => void;
}

export function Order2FA({ onSendCode }: Order2FAProps) {
    const [code, setCode] = useState('');

    return (
        <div className='order-status__2fa'>
            <p>Введите код подтверждения</p>
            <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='123456'
            />
            <button onClick={() => onSendCode(code)} disabled={!code}>
                Отправить
            </button>
        </div>
    );
}
