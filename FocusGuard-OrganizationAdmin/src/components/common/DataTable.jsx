import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import { useLanguage } from "../../context/useLanguage";

import EmptyState from "./EmptyState";

function DataTable({
    columns,
    rows,
}) {
    const { t } = useLanguage();

    if (!rows.length) {
        return (
            <EmptyState
                message={t(
                    "no_records_found",
                    "No records found."
                )}
            />
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.field}
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {column.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                >
                                    {row[column.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;