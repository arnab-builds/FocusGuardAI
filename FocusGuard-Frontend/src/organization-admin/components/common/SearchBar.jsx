import {
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { useLanguage } from "../../context/useLanguage";

function SearchBar({
    value,
    onChange,
    placeholder,
}) {
    const { t } = useLanguage();

    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={onChange}
            placeholder={
                placeholder ||
                t("search", "Search...")
            }
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