import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useState } from "react";

type SearchBarProps = {
    handleValue(value: string): void;
}
function SearchBar({handleValue} : SearchBarProps) {
    const [value, setValue] = useState('');

    function clearInput() {
        setValue('');
    }

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        handleValue(value);
    }

    return (
        <form style={
            {
                maxWidth: '700px',
                width: '100%',
                padding: '10px',
                margin: '0 auto'
            }}        
            onSubmit={handleSubmit}
        >
            <OutlinedInput
                size="small"
                fullWidth
                placeholder="Pesquisar..."
                onChange={(e) => setValue(e.target.value)}
                value={value}                
                endAdornment={
                    <>
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="search"
                                edge="end"
                                type="submit"
                            >
                                <Search/>
                            </IconButton>
                        </InputAdornment>
                        {!!value &&  
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="search"
                                edge="end"
                                onClick={clearInput}
                            >
                                <Clear/>
                            </IconButton>
                        </InputAdornment>}
                    </>
                }
            />
        </form>
    )
}

export default SearchBar;