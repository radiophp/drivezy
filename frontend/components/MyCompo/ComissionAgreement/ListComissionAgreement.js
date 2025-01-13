import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Fab } from '@mui/material';
import {
    useGetAllComissionAgreementsQuery,
    useDeleteComissionAgreementMutation,
    comissionAgreementApiSlice
} from "@/redux/slices/comissionAgreementApiSlice"; // Adjust the path and function name accordingly
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ClearIcon from '@mui/icons-material/Clear';
import Link from 'next/link';
import SearchBar from "@/components/MyCompo/ComissionAgreement/SearchBar"; // Adjust the path based on your file structure
import Pagination from "@/components/MyCompo/ComissionAgreement/Pagination"; // Adjust the path based on your file structure
import HumanReadableDate from "@/components/MyCompo/_Tools/HumanReadableDate"; // Adjust the path based on your file structure
import useTranslation from "next-translate/useTranslation";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ActionButtons = ({ pdfUrl, onDelete, isCancelled }) => (
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

const ListCommissionAgreement = () => {
    const { t } = useTranslation('common');
    const { data: commissionAgreements, isLoading, error } = useGetAllComissionAgreementsQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTermInput, setSearchTermInput] = useState('');
    // const [filteredAgreements, setFilteredAgreements] = useState(commissionAgreements?.data);
    const [filteredAgreements, setFilteredAgreements] = useState([]);
    const [deleteAgreement] = useDeleteComissionAgreementMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [agreementToDelete, setAgreementToDelete] = useState(null);
    // Debounced function
    const debouncedSetSearchTerm = useCallback(
        debounce((newSearchTerm) => {

            setSearchTerm(newSearchTerm);
        }, 500),
        []
    );

    useEffect(() => {
        if (commissionAgreements?.data) {
            const newFilteredAgreements = searchTerm
                ? commissionAgreements?.data.filter((agreement) => {
                    const searchTermLower = searchTerm.toLowerCase().trim();
                    const buyerFullName = `${agreement.buyerDetails?.name.trim()} ${agreement.buyerDetails?.family.trim()}`.toLowerCase();
                    //  const sellerFullName = `${agreement.sellerDetails?.name.trim()} ${agreement.sellerDetails?.family.trim()}`.toLowerCase() ;
                    const carDetailsCombined = `${agreement.carDetails?.brand.trim()} ${agreement.carDetails?.model.trim()} ${agreement.carDetails?.color.trim()}`.toLowerCase();

                    return (
                        carDetailsCombined.includes(searchTermLower) ||
                        buyerFullName.includes(searchTermLower) ||
                        //      sellerFullName.includes(searchTermLower) ||
                        agreement.carDetails?.plateNo?.toLowerCase().includes(searchTermLower)
                    );
                })
                : commissionAgreements.data;
            setFilteredAgreements(newFilteredAgreements);
        }

    }, [commissionAgreements?.data, searchTerm]);

    const openDeleteDialog = (id) => {
        setAgreementToDelete(id);
        setIsDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDialogOpen(false);
        setAgreementToDelete(null);
    };


    const handleDelete = async (id) => {
        if (agreementToDelete) {
            try {
                await deleteAgreement(agreementToDelete);
                // Update the filteredAgreements state to remove the deleted item
                const updatedAgreements = filteredAgreements.map(agreement =>
                    agreement.invoiceDetails._id === agreementToDelete
                        ? { ...agreement, invoiceDetails: { ...agreement.invoiceDetails, status: 'canceled' } }
                        : agreement
                );
                setFilteredAgreements(updatedAgreements);
            } catch (error) {
                console.error('Failed to delete the car:', error);
            }
        }
        closeDeleteDialog();
    };




    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - commissionAgreements.data.length) : 0;

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
    if (isLoading) {
        return <div>Loading commission agreements...</div>;
    }

    if (error) {
        return <div>Error fetching commission agreements.</div>;
    }


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
                            <TableCell>{t('invoice.car')}</TableCell>
                            <TableCell>{t('cars.date')}</TableCell>
                            <TableCell align="center">{t('invoice.buyer')}</TableCell>
                            {/*<TableCell align="center">{t('invoice.seller')}</TableCell>*/}
                            <TableCell align="center">{t('cars.plate_no')}</TableCell>
                            <TableCell align="center">{t('act.actions')}</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? filteredAgreements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredAgreements
                        ).map((agreement) => (
                            // agreement?.invoiceDetails?.status ==='canceled' ?
                            <TableRow key={agreement.invoiceDetails._id} sx={{ backgroundColor: agreement?.invoiceDetails?.status === 'canceled' ? '#e8adad' : '' }} >
                                <TableCell>
                                {agreement.carDetails ? 
                                    `${agreement.carDetails.brand} ${agreement.carDetails.model} 
                                    ${agreement.carDetails.description ? '- '+agreement.carDetails.description + ' ' : ''} 
                                    ${agreement.carDetails.color ? ' - '+agreement.carDetails.color : ''}` 
                                    : ''}
                                </TableCell>
                                <TableCell>
                                    <HumanReadableDate dateString={agreement.invoiceDetails.createdAt} />
                                </TableCell>
                                <TableCell align="center">
                                    {`${agreement.buyerDetails.name} ${agreement.buyerDetails.family}`}
                                </TableCell>
                                {/*<TableCell align="center">*/}
                                {/*    {`${agreement.sellerDetails.name} ${agreement.sellerDetails.family}`}*/}
                                {/*</TableCell>*/}
                                <TableCell align="center">

                                    {agreement.carDetails ? agreement.carDetails.plateNo : "No car"}
                                </TableCell>
                                <TableCell align="center">
                                    <ActionButtons
                                        pdfUrl={agreement.invoiceDetails.invoiceLink ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')}${agreement.invoiceDetails.invoiceLink.replace(/\\/g, '/')}` : ''}
                                        onDelete={() => openDeleteDialog(agreement.invoiceDetails._id)}
                                        isCancelled={agreement?.invoiceDetails?.status === 'canceled'}
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
                        items={filteredAgreements}
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

export default ListCommissionAgreement;
