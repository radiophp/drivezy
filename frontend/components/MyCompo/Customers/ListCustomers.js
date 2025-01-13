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
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import {useRouter} from 'next/router';
import SearchBar from "@/components/MyCompo/Customers/SearchBar"; // Update the path
import Pagination from "@/components/MyCompo/Customers/Pagination"; // Update the path
import {format} from "date-fns";
import {useDeleteCustomerMutation, useGetAllCustomersQuery} from '@/redux/slices/customersApiSlice'; // Update the import path
import DeleteCustomerConfirmationDialog from "@/components/MyCompo/Customers/DeleteCustomerConfirmationDialog";
import useTranslation from "next-translate/useTranslation"; // Update the path

const CustomTableCell = ({title, align, children}) => (
    <TableCell
        align={align}
        sx={{
            borderBottom: "1px solid #F7FAFF",
            padding: "8px 10px",
            fontSize: "13px",
        }}
        title={title}
    >
        {children}
    </TableCell>
);

const ActionButtons = ({onEdit, onDelete}) => (
    <>
        <Fab
            color="primary"
            aria-label="edit"
            size="small"
            variant="extended"
            onClick={onEdit}
        >
            <EditIcon sx={{color: "#fff !important"}}/>
        </Fab>{' '}
        {/*<Fab*/}
        {/*    color="danger"*/}
        {/*    aria-label="delete"*/}
        {/*    size="small"*/}
        {/*    variant="extended"*/}
        {/*    onClick={onDelete}*/}
        {/*>*/}
        {/*    <ClearIcon sx={{color: "#fff !important"}}/>*/}
        {/*</Fab>*/}
    </>
);

function createData(_id, name, family, nationalCode, contactInfo, email, companyName, taxNumber, updatedAt, createdAt) {
    return {
        _id,
        name,
        family,
        nationalCode,
        contactInfo,
        email,
        companyName,
        taxNumber,
        updatedAt,
        createdAt,
    };
}

const ListCustomers = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const {data, error, isLoading} = useGetAllCustomersQuery();
    const [deleteCustomer] = useDeleteCustomerMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClickOpen = (customer) => {
        setSelectedCustomer(customer);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        await handleOnDelete(selectedCustomer._id);
        setDialogOpen(false);
    };

    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        if (data?.data) {
            const customersData = data.data.map(customer => createData(
                customer._id,
                customer.name,
                customer.family,
                customer.nationalCode,
                customer.contactInfo,
                customer.email,
                customer.companyName || '',
                customer.taxNumber || '',
                customer.updatedAt,
                customer.createdAt
            ));
            setCustomers(customersData);
        }
    }, [data]);

    const handleOnDelete = async (customerId) => {
        try {
            await deleteCustomer(customerId);
            const updatedCustomers = customers.filter(customer => customer._id !== customerId);
            setCustomers(updatedCustomers);
        } catch (error) {
            console.error('Failed to delete the customer:', error);
        }
    };

    const handleOnEdit = (customerId) => {
        router.push(`/customers/update/${customerId}`);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error occurred: {error.message}</p>;
    }

    return (
        <>
            <Card sx={{boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px"}}>
                <SearchBar handleSearchChange={handleSearchChange} searchTerm={searchTerm} t={t}/>

                <TableContainer component={Paper} sx={{boxShadow: "none"}}>
                    <Table sx={{minWidth: 950}} aria-label="custom pagination table" className="dark-table">
                        <TableHead sx={{background: "#F7FAFF"}}>
                            <TableRow>
                                <TableCell sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('customer.full_name')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('customer.national_code')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('customer.contact_info')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('customer.email')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('act.update_at')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('act.created_at')}
                                </TableCell>
                                <TableCell align="center" sx={{borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px"}}>
                                    {t('act.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {(rowsPerPage > 0
                                    ? filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filteredCustomers
                            ).map((row) => (
                                <TableRow key={row._id}>
                                    <CustomTableCell title={row._id}>
                                        {row.name} {row.family}
                                        {row?.companyName && <div><i>({row.companyName})</i></div>}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        {row.nationalCode}
                                        {row?.taxNumber && <div><i>({row.taxNumber})</i></div>}
                                    </CustomTableCell>
                                    <CustomTableCell align="center">{row.contactInfo}</CustomTableCell>
                                    <CustomTableCell align="center">{row.email}</CustomTableCell>
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
                                <TableRow style={{height: 53 * emptyRows}}>
                                    <TableCell colSpan={8} style={{borderBottom: "1px solid #F7FAFF"}}/>
                                </TableRow>
                            )}
                        </TableBody>

                        <Pagination customers={customers} page={page} rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                    t={t}
                        />
                    </Table>
                </TableContainer>
            </Card>

            <DeleteCustomerConfirmationDialog
                open={dialogOpen}
                customer={selectedCustomer}
                onClose={closeDialog}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

export default ListCustomers;
