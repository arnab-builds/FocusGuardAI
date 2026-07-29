import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/useLanguage";

function NotFound() {
    const { t } = useLanguage();

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
                {t(
                    "page_not_found",
                    "Page Not Found"
                )}
            </Typography>

            <Button
                component={Link}
                to="/"
                variant="contained"
            >
                {t(
                    "go_to_dashboard",
                    "Go to Dashboard"
                )}
            </Button>
        </Box>
    );
}

export default NotFound;