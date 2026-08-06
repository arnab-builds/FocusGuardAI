import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import { useLanguage } from "../../context/useLanguage";

function ConfirmDialog({
    open,
    title,
    message,
    onClose,
    onConfirm,
}) {
    const { t } = useLanguage();

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    {t("cancel", "Cancel")}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                >
                    {t("confirm", "Confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;