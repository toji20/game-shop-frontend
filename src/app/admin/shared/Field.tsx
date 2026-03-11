interface FieldProps {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    textarea?: boolean;
    autoFocus?: boolean;
    type?: string;
    placeholder?: string;
}

export default function Field({
    label,
    value,
    onChange,
    textarea,
    autoFocus,
    type = 'text',
    placeholder,
}: FieldProps) {
    return (
        <div className='form-group'>
            <label className='form-label'>{label}</label>
            {textarea ? (
                <textarea
                    className='form-input'
                    rows={3}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    className='form-input'
                    type={type}
                    value={value}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
}
