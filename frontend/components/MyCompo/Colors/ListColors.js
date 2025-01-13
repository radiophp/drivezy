import * as React from "react";
import {useEffect, useState} from "react";

import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import {useRouter} from 'next/router';
import SearchBar from "@/components/MyCompo/Colors/SearchBar";
import Pagination from "@/components/MyCompo/Colors/Pagination";
import { format } from 'date-fns';

import {
    Card,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Fab,
} from '@mui/material';

import { useGetAllColorsQuery, useDeleteColorMutation } from '@/redux/slices/colorsApiSlice'; // Adjust the path based on your file structure
import DeleteColorConfirmationDialog from '@/components/MyCompo/Colors/DeleteColorConfirmationDialog';
import useTranslation from "next-translate/useTranslation"; // Adjust the path based on your file structure

const CustomTableCell = ({ title, align, children }) => (
    <TableCell
        align={align}
        sx={{
            borderBottom: '1px solid #F7FAFF',
            padding: '8px 10px',
            fontSize: '13px',
        }}
        title={title}
    >
        {children}
    </TableCell>
);

const ActionButtons = ({ onEdit, onDelete }) => (
    <>
        <Fab
            color="primary"
            aria-label="edit"
            size="small"
            variant="extended"
            onClick={onEdit}
        >
            <EditIcon sx={{ color: '#fff !important' }} />
        </Fab>{' '}
        {/*<Fab*/}
        {/*    color="danger"*/}
        {/*    aria-label="delete"*/}
        {/*    size="small"*/}
        {/*    variant="extended"*/}
        {/*    onClick={onDelete}*/}
        {/*>*/}
        {/*    <ClearIcon sx={{ color: '#fff !important' }} />*/}
        {/*</Fab>*/}
    </>
);

function createData(_id, name, updatedAt, createdAt) {
    return {
        _id,
        name,
        updatedAt,
        createdAt,
    };
}

const ListColors = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { data, error, isLoading } = useGetAllColorsQuery();
    const [deleteColor] = useDeleteColorMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [colors, setColors] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (data?.data) {
            const colorsData = data.data.map(color =>
                createData(color._id, color.name, color.updatedAt, color.createdAt)
            );

            setColors(colorsData);
        }
    }, [data]);

    const openDialog = (color) => {
        setSelectedColor(color);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        await handleOnDelete(selectedColor._id);
        setDialogOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClickOpen = (color) => {
        setSelectedColor(color);
        setDialogOpen(true);
    };

    const handleOnDelete = async (colorID) => {
        try {
            await deleteColor(colorID);
            const updatedColors = colors.filter(color => color._id !== colorID);
            setColors(updatedColors);
        } catch (error) {
            console.error('Failed to delete the color:', error);
        }
    };

    const handleOnEdit = (colorID) => {
        router.push(`/colors/update/${colorID}`);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - colors.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredColors = colors.filter(color =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error occurred: {error.message}</p>;
    }

    return (
        <>
            <Card
                sx={{
                    boxShadow: 'none',
                    borderRadius: '10px',
                    p: '25px 25px 10px',
                    mb: '15px',
                }}
            >
                <SearchBar handleSearchChange={ handleSearchChange } searchTerm={ searchTerm } t={t} />

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table
                        sx={{ minWidth: 950 }}
                        aria-label="custom pagination table"
                        className="dark-table"
                    >
                        <TableHead sx={{ background: '#F7FAFF' }}>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        borderBottom: '1px solid #F7FAFF',
                                        fontSize: '13.5px',
                                        padding: '15px 10px',
                                    }}
                                >
                                    {t('cars.color')}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        borderBottom: '1px solid #F7FAFF',
                                        fontSize: '13.5px',
                                        padding: '15px 10px',
                                    }}
                                >
                                    {t('act.update_at')}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        borderBottom: '1px solid #F7FAFF',
                                        fontSize: '13.5px',
                                        padding: '15px 10px',
                                    }}
                                >
                                    {t('act.created_at')}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        borderBottom: '1px solid #F7FAFF',
                                        fontSize: '13.5px',
                                        padding: '15px 10px',
                                    }}
                                >
                                    {t('act.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? filteredColors.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    : filteredColors
                            ).map((row) => (
                                <TableRow key={row._id}>
                                    <CustomTableCell title={row._id}>
                                        {row.name}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        {format(new Date(row.updatedAt), 'dd-MM-yyyy HH:mm')}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        {format(new Date(row.createdAt), 'dd-MM-yyyy HH:mm')}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        <ActionButtons
                                            onEdit={() => handleOnEdit(row._id)}
                                            onDelete={() => handleClickOpen(row)}
                                        />
                                    </CustomTableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell
                                        colSpan={6}
                                        style={{ borderBottom: '1px solid #F7FAFF' }}
                                    />
                                </TableRow>
                            )}
                        </TableBody>
                        <Pagination colors={ colors } page={ page } rowsPerPage={ rowsPerPage }
                                    handleChangePage={ handleChangePage }
                                    handleChangeRowsPerPage={ handleChangeRowsPerPage }
                                    t={t}

                        />
                    </Table>
                </TableContainer>
            </Card>
            <DeleteColorConfirmationDialog
                open={dialogOpen}
                color={selectedColor}
                onClose={closeDialog}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default ListColors;

