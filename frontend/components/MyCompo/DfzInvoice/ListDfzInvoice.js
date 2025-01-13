import React, {useState, useCallback, useEffect} from 'react';
import debounce from 'lodash/debounce';
import { Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Fab } from '@mui/material';
import { useGetAllDfzInvoicesQuery ,useDeleteDfzInvoiceMutation } from "@/redux/slices/dfzInvoiceApiSlice"; // Adjust the path and function name accordingly
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Link from 'next/link';
import SearchBar from "@/components/MyCompo/DfzInvoice/SearchBar"; // Adjust the path based on your file structure
import Pagination from "@/components/MyCompo/DfzInvoice/Pagination"; // Adjust the path based on your file structure
import HumanReadableDate from "@/components/MyCompo/_Tools/HumanReadableDate"; // Adjust the path based on your file structure
import useTranslation from "next-translate/useTranslation"; // Adjust the path based on your file structure
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ClearIcon from "@mui/icons-material/Clear";

const ActionButtons = ({ pdfUrl ,onDelete,isCancelled}) => (
    <>
        <Link href={pdfUrl} passHref>
            <Fab
                color="primary" // Adjust the color as needed
                aria-label="download"
                size="small"
                variant="extended"
            >
                <CloudDownloadIcon />
            </Fab>
        </Link>{' '}
        {!isCancelled && (
            <Fab
                color="danger"
                aria-label="delete"
                size="small"
                variant="extended"
                onClick={onDelete}
            >
                <ClearIcon sx={{ color: '#fff !important' }} />
            </Fab>
        )}
    </>
);


const ListDfzInvoice = ( ) => {
    const { t } = useTranslation('common');
    const { data: dfzInvoices, isLoading, error } = useGetAllDfzInvoicesQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTermInput, setSearchTermInput] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteItem] = useDeleteDfzInvoiceMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    // Debounced function
    const debouncedSetSearchTerm = useCallback(
        debounce((newSearchTerm) => {

            setSearchTerm(newSearchTerm);
        }, 500),
        []
    );
    useEffect(() => {
        if(dfzInvoices?.data)
        {
            const filteredInvoices = searchTerm
                ? dfzInvoices?.data.filter((agreement) => {
                    const searchTermLower = searchTerm.toLowerCase().trim();
                    const customerFullName = `${agreement.customerDetails?.name.trim()} ${agreement.customerDetails?.family.trim()}`.toLowerCase() ;
                    const carDetailsCombined = `${agreement.carDetails?.brand.trim()} ${agreement.carDetails?.model.trim()} ${agreement.carDetails?.color.trim()}`.toLowerCase();
                    const invoiceNumber = agreement.invoiceDetails?.invoiceNumber?.toLowerCase().trim() || '';
                    return (
                        carDetailsCombined.includes(searchTermLower) ||
                        customerFullName.includes(searchTermLower) ||
                        agreement.carDetails?.plateNo?.toLowerCase().includes(searchTermLower)||
                        invoiceNumber.includes(searchTermLower)
                    );
                })
                : dfzInvoices.data;
            setFilteredItems(filteredInvoices);
        }

    }, [ dfzInvoices?.data,searchTerm]);
    const openDeleteDialog = (id) => {
        setItemToDelete(id);
        setIsDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDialogOpen(false);
        setItemToDelete(null);
    };
    if (isLoading) {
        return <div>Loading invoices...</div>;
    }

    if (error) {
        return <div>Error fetching invoices.</div>;
    }

    if (!dfzInvoices?.data) {
        return <div>No Dfz invoices found.</div>;
    }
    // const filteredInvoices = searchTerm
    //     ? dfzInvoices?.data.filter((agreement) => {
    //         const searchTermLower = searchTerm.toLowerCase().trim();
    //         const customerFullName = `${agreement.customerDetails?.name.trim()} ${agreement.customerDetails?.family.trim()}`.toLowerCase() ;
    //         const carDetailsCombined = `${agreement.carDetails?.brand.trim()} ${agreement.carDetails?.model.trim()} ${agreement.carDetails?.color.trim()}`.toLowerCase();
    //
    //         return (
    //             carDetailsCombined.includes(searchTermLower) ||
    //             customerFullName.includes(searchTermLower) ||
    //             agreement.carDetails?.plateNo?.toLowerCase().includes(searchTermLower)
    //         );
    //     })
    //     : dfzInvoices.data;
    const handleDelete =async (id) => {
        if (itemToDelete) {
            try {
                await deleteItem(itemToDelete);
                // Update the filteredAgreements state to remove the deleted item
                const updatedAgreements = filteredItems.map(agreement =>
                    agreement.invoiceDetails._id === itemToDelete
                        ? { ...agreement, invoiceDetails: { ...agreement.invoiceDetails, status: 'canceled' } }
                        : agreement
                );
                setFilteredItems(updatedAgreements);
            } catch (error) {
                console.error('Failed to delete the car:', error);
            }
        }
        closeDeleteDialog();
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredItems.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleSearchChange = (e) => {
        setSearchTermInput(e.target.value);
        debouncedSetSearchTerm(e.target.value);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <Card
            sx={{
                boxShadow: 'none',
                borderRadius: '10px',
                p: '25px 25px 10px',
                mb: '15px',
            }}
        >
            <SearchBar handleSearchChange={handleSearchChange} searchTerm={searchTerm} searchTermInput={searchTermInput} t={t} />

            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table
                    sx={{ minWidth: 950 }}
                    aria-label="custom pagination table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>{t('invoice.car')}</TableCell>
                            <TableCell>{t('cars.date')}</TableCell>
                            <TableCell align="center">{t('invoice.customer')}</TableCell>
                            <TableCell align="center">{t('customer.contactInfo')}</TableCell>
                            <TableCell align="center">{t('cars.plate_no')}</TableCell>
                            <TableCell align="center">{t('act.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                                ? filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredItems
                        ).map((invoice) => (
                            <TableRow key={invoice.invoiceDetails._id} sx={{backgroundColor :invoice?.invoiceDetails?.status ==='canceled' ?'#e8adad':'' }}>
                                <TableCell >
                                    {invoice.invoiceDetails?.invoiceNumber}
                                </TableCell>
                                <TableCell>
                                {invoice.carDetails ? 
                                    `${invoice.carDetails.brand} ${invoice.carDetails.model} 
                                    ${invoice.carDetails.description ? '- '+invoice.carDetails.description + ' ' : ''} 
                                    ${invoice.carDetails.color ? ' - '+invoice.carDetails.color : ''}` 
                                    : ''} 
                                </TableCell>
                                <TableCell>
                                    <HumanReadableDate dateString={invoice.invoiceDetails.createdAt} />
                                </TableCell>
                                <TableCell align="center">
                                    {`${invoice.customerDetails.name} ${invoice.customerDetails.family}`}
                                </TableCell>
                                <TableCell align="center">
                                    {invoice.customerDetails.contactInfo}
                                </TableCell>
                                <TableCell align="center">
                                    {invoice.carDetails ? invoice.carDetails.plateNo : "No car"}
                                </TableCell>
                                <TableCell align="center">
                                    <ActionButtons
                                        pdfUrl={invoice.invoiceDetails.invoiceLink ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')}${invoice.invoiceDetails.invoiceLink.replace(/\\/g, '/')}` : ''}
                                        onDelete={() => openDeleteDialog(invoice.invoiceDetails._id)}
                                        isCancelled={invoice?.invoiceDetails?.status ==='canceled'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <Pagination
                        items={filteredItems}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        t={t}
                    />
                </Table>
            </TableContainer>
            <Dialog
                open={isDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t('invoice.cancellation')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('invoice.cancellation_confirm')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        {t('act.no')}
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        {t('act.yes')}
                    </Button>
                </DialogActions>
            </Dialog>

        </Card>
    );
};

export default ListDfzInvoice;
