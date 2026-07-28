import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Typography variant="h2">
                404
            </Typography>

            <Typography variant="h5">
                Page Not Found
            </Typography>

            <Button
                component={Link}
                to="/"
                variant="contained"
            >
                Go to Dashboard
            </Button>
        </Box>
    );
}

export default NotFound;