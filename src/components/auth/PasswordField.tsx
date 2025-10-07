import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type PasswordFieldProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    error?: boolean;
    helperText?: string;
};


const PasswordField = ({
    label,
    value,
    onChange,
    name = "password",
    error,
    helperText
}: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const slotProps = {
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }


    return (
        <TextField
            type={showPassword ? 'text' : 'password'}
            label={label}
            value={value}
            onChange={onChange}
            name={name}
            error={error}
            helperText={helperText}
            fullWidth
            margin="normal"
            required
            slotProps={slotProps}
        />
    );
};

export default PasswordField;