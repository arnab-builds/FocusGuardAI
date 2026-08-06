import {
    Box,
    CircularProgress,
} from "@mui/material";

function LoadingSpinner() {
    return (
        <Box
            sx={{
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default LoadingSpinner;