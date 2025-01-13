import * as React from "react";
import {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {useDeleteBrandMutation, useGetAllBrandsQuery} from '@/redux/slices/brandsApiSlice';
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteBrandConfirmationDialog from "@/components/MyCompo/Brands/DeleteBrandConfirmationDialog";
import {useRouter} from 'next/router';
import SearchBar from "@/components/MyCompo/Brands/SearchBar";
import Pagination from "@/components/MyCompo/Brands/Pagination";
import {format} from "date-fns";
import useTranslation from "next-translate/useTranslation";

const CustomTableCell = ({title, align, children}) => (
    <TableCell
        align={ align }
        sx={ {
            borderBottom: "1px solid #F7FAFF",
            padding: "8px 10px",
            fontSize: "13px",
        } }
        title={ title }
    >
        { children }
    </TableCell>
);
const ActionButtons = ({onEdit, onDelete}) => (
    <>
        <Fab
            color="primary"
            aria-label="edit"
            size="small"
            variant="extended"
            onClick={ onEdit }
        >
            <EditIcon sx={ {color: "#fff !important"} }/>
        </Fab>{ " " }
        {/*<Fab*/}
        {/*    color="danger"*/}
        {/*    aria-label="delete"*/}
        {/*    size="small"*/}
        {/*    variant="extended"*/}
        {/*    onClick={ onDelete }*/}
        {/*>*/}
        {/*    <ClearIcon sx={ {color: "#fff !important"} }/>*/}
        {/*</Fab>*/}
    </>
);


function createData(
    _id,
    name,
    updatedAt,
    createdAt
) {
    return {
        _id,
        name,
        updatedAt,
        createdAt
    };
}


const ListBrands = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const {data, error, isLoading} = useGetAllBrandsQuery();  // no need to pass token
    //const { data, error, isLoading } = useGetAllBrandsQuery();
    const [deleteBrand] = useDeleteBrandMutation(); // Initialize the mutation hook
    // ... (rest of the existing code)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    // Step 1: Add a state variable to hold the search term
    const [searchTerm, setSearchTerm] = useState('');
    const openDialog = (brand) => {
        setSelectedBrand(brand);
        setDialogOpen(true);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleClickOpen = (brand) => {
        setSelectedBrand(brand);
        setDialogOpen(true);
    };
    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = async (brandID) => {

        await handleOnDelete(selectedBrand._id);
        setDialogOpen(false);
    };
    const brandsData = data?.data;

    const [brands, setBrands] = useState([]);// Manage brands in local state
    useEffect(() => {
        if (data?.data) {
            const brandsData = data.data.map(brand => createData(
                brand._id,
                brand.name,
                brand.updatedAt,
                brand.createdAt
            ));
            setBrands(brandsData);
            console.log("brandsData", brandsData)
        }
    }, [data]);

    const handleOnDelete = async (brandID) => {
        try {
            await deleteBrand(brandID);
            const updatedBrands = brands.filter(brand => brand._id !== brandID);
            setBrands(updatedBrands); // Update the local state after deletion
        } catch (error) {
            console.error('Failed to delete the brand:', error);
        }
    };

    const handleOnEdit = (brandID) => {
        const {_id} = router.query;
        router.push(`/brands/update/${ brandID }`);
        // Usually, it would involve navigating to an edit page or opening an edit modal
    };
    // Table
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - brands.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error occurred: { error.message }</p>;
    }
    return (
        <>
            <Card
                sx={ {
                    boxShadow: "none",
                    borderRadius: "10px",
                    p: "25px 25px 10px",
                    mb: "15px",
                } }
            >
                <SearchBar handleSearchChange={ handleSearchChange } searchTerm={ searchTerm } t={t}/>


                <TableContainer
                    component={ Paper }
                    sx={ {
                        boxShadow: "none",
                    } }
                >
                    <Table
                        sx={ {minWidth: 950} }
                        aria-label="custom pagination table"
                        className="dark-table"
                    >
                        <TableHead sx={ {background: "#F7FAFF"} }>
                            <TableRow>


                                <TableCell
                                    sx={ {
                                        borderBottom: "1px solid #F7FAFF",
                                        fontSize: "13.5px",
                                        padding: "15px 10px",
                                    } }
                                >
                                    {t('cars.brand')}
                                </TableCell>


                                <TableCell
                                    align="center"
                                    sx={ {
                                        borderBottom: "1px solid #F7FAFF",
                                        fontSize: "13.5px",
                                        padding: "15px 10px",
                                    } }
                                >
                                    {t('act.update_at')}
                                </TableCell>

                                <TableCell
                                    align="center"
                                    sx={ {
                                        borderBottom: "1px solid #F7FAFF",
                                        fontSize: "13.5px",
                                        padding: "15px 10px",
                                    } }
                                >
                                    {t('act.update_at')}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={ {
                                        borderBottom: "1px solid #F7FAFF",
                                        fontSize: "13.5px",
                                        padding: "15px 10px",
                                    } }
                                >
                                    {t('act.actions')}
                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            { (rowsPerPage > 0
                                    ? filteredBrands.slice( // Updated from 'brands' to 'filteredBrands'
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    : filteredBrands // Updated from 'brands' to 'filteredBrands'
                            ).map((row) => (
                                <TableRow key={ row._id }>

                                    <CustomTableCell title={ row._id }>
                                        { row.name }
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        {format(new Date(row.updatedAt), 'dd-MM-yyyy HH:mm')}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        {format(new Date(row.createdAt), 'dd-MM-yyyy HH:mm')}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        <ActionButtons
                                            onEdit={ () => handleOnEdit(row._id) }
                                            onDelete={ () => handleClickOpen(row) }
                                        />
                                    </CustomTableCell>
                                </TableRow>
                            )) }

                            { emptyRows > 0 && (
                                <TableRow style={ {height: 53 * emptyRows} }>
                                    <TableCell
                                        colSpan={ 8 }
                                        style={ {borderBottom: "1px solid #F7FAFF"} }
                                    />
                                </TableRow>
                            ) }
                        </TableBody>
                        <Pagination brands={ brands } page={ page } rowsPerPage={ rowsPerPage }
                                    handleChangePage={ handleChangePage }
                                    handleChangeRowsPerPage={ handleChangeRowsPerPage }
                                    t={t}
                        />

                    </Table>
                </TableContainer>
            </Card>
            <DeleteBrandConfirmationDialog
                open={ dialogOpen }
                brand={ selectedBrand }
                onClose={ closeDialog }
                onConfirm={ handleConfirmDelete }
            />
        </>
    );
}
export default ListBrands;
