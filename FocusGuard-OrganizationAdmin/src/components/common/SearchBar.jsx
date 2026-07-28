import {
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
}) {
    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default SearchBar;