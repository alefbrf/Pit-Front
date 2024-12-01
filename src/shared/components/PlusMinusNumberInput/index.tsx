import { Add, Remove } from "@mui/icons-material";
import { IconButton, Input } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
type PlusMinusNumberInputProps = {
    onChange(value: number): void;
    value?: number;
}

export default function PlusMinusNumberInput(props : PlusMinusNumberInputProps) {
    const [value, setValue] = useState(props.value || 1);
    
    function increment() {
        const newValue = value + 1;
        setValue(newValue);

        props.onChange(newValue);
    }    
    function decrement() {        
        let newValue = value - 1;
        if (newValue <= 1) {
            newValue = 1;
        }
        setValue(newValue);
        props.onChange(newValue);
    }
    function stopPropagation(event: React.MouseEvent<HTMLInputElement>) {
        event.stopPropagation();
    }

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        let newValue = Number(e.target.value);
        if (newValue <= 1) {
            newValue = 1;
        }

        setValue(newValue);
        props.onChange(newValue);
    }

    return (
        <div onClick={stopPropagation} style={{
            display: 'flex',
            width: '115px'
        }}>
            <IconButton color="primary" onClick={decrement}>
                <Remove />
            </IconButton>
            <Input type="number" value={value} onChange={onChange} />
            <IconButton color="primary" onClick={increment}>
                <Add />
            </IconButton>
        </div>
    )
}