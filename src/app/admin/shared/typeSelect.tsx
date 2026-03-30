import { GameType } from '@/shared/types';

export const TypeSelect = ({
    value,
    onChange,
}: {
    value: GameType;
    onChange: (v: GameType) => void;
}) => (
    <div className='form-group'>
        <label className='form-label'>Тип</label>
        <select
            className='form-input'
            value={value}
            onChange={(e) => onChange(e.target.value as GameType)}
        >
            <option value='AUTO'>AUTO — автоматическая выдача</option>
            <option value='MANUAL'>MANUAL — ручная выдача</option>
        </select>
    </div>
);
