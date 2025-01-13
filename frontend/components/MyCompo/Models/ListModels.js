import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDeleteModelMutation, useGetAllModelsQuery } from '@/redux/slices/modelsApiSlice';
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteModelConfirmationDialog from "@/components/MyCompo/Models/DeleteModelConfirmationDialog";
import { useRouter } from 'next/router';
import SearchBar from "@/components/MyCompo/Models/SearchBar";
import Pagination from "@/components/MyCompo/Models/Pagination";
import { format } from "date-fns";
import { useGetAllBrandsQuery } from '@/redux/slices/brandsApiSlice';
import useTranslation from "next-translate/useTranslation";
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
const CustomTableCell = ({ title, align, children }) => (
    <TableCell
        align={align}
        sx={{
            borderBottom: "1px solid #F7FAFF",
            padding: "8px 10px",
            fontSize: "13px",
            textAlign: "left",
        }}
        title={title}
    >
        {children}
    </TableCell>
);

function createData(_id, name, brand, updatedAt, createdAt) {
    return {
        _id,
        name,
        brand,
        updatedAt,
        createdAt
    };
}

const ListModels = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { data: modelsData, error, isLoading } = useGetAllModelsQuery();
    const { data: brandsData } = useGetAllBrandsQuery(); // Fetch all brands
    const [deleteModel] = useDeleteModelMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [models, setModels] = useState([]);
    const [brandMap, setBrandMap] = useState({});
    useEffect(() => {
        // Create a mapping of brand ID to brand name
        if (brandsData?.data) {
            const map = {};
            brandsData.data.forEach(brand => {
                map[brand._id] = brand.name;
            });
            setBrandMap(map);
        }
    }, [brandsData]);
    useEffect(() => {
        if (modelsData?.data) {
            const modelData = modelsData.data.map(model => createData(
                model._id,
                model.name,
                model.brand,
                model.updatedAt,
                model.createdAt
            ));
            setModels(modelData);
        }
    }, [modelsData]);

    const openDialog = (model) => {
        setSelectedModel(model);
        setDialogOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = async (modelID) => {
        try {
            await deleteModel(modelID);
            const updatedModels = models.filter(model => model._id !== modelID);
            setModels(updatedModels);
            setDialogOpen(false);
        } catch (error) {
            console.error('Failed to delete the model:', error);
        }
    };

    const filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleOnEdit = (colorID) => {
        router.push(`/models/update/${colorID}`);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - models.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred: {error.message}</p>;

    return (
        <>
            <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px" }}>
                <SearchBar handleSearchChange={handleSearchChange} searchTerm={searchTerm} t={t} />
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                    <Table sx={{ minWidth: 950 }} aria-label="custom pagination table">
                        <TableHead sx={{ background: "#F7FAFF" }}>
                            <TableRow>
                                <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}> {t('cars.model')} </TableCell>
                                <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}>{t('cars.brand')} </TableCell>
                                <TableCell   sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}>{t('act.update_at')}</TableCell>
                                <TableCell   sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}>{t('act.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0 ? filteredModels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredModels).map((row) => (
                                <TableRow key={row._id}>
                                    <CustomTableCell title={row._id}>{row.name}</CustomTableCell>
                                    <CustomTableCell align="center">{brandMap[row.brand] || row.brand}</CustomTableCell>
                                    <CustomTableCell align="center">{format(new Date(row.updatedAt), 'dd-MM-yyyy HH:mm')}</CustomTableCell>
                                    <CustomTableCell align="center">

                                        <ActionButtons
                                            onEdit={() => handleOnEdit(row._id)}
                                            onDelete={() => openDialog(row)}
                                        />
                                    </CustomTableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <Pagination t={t} models={models} page={page} rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />

                    </Table>
                </TableContainer>
            </Card>
            <DeleteModelConfirmationDialog open={dialogOpen} model={selectedModel} onClose={closeDialog} onConfirm={handleConfirmDelete} />
        </>
    );
}

export default ListModels;
