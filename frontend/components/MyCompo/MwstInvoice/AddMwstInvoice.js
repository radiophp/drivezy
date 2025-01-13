import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, FormControl, Select, MenuItem, Grid, Button, InputLabel, Autocomplete, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputAdornment
} from "@mui/material";
import Card from "@mui/material/Card";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddMwstInvoiceMutation } from '@/redux/slices/mwstInvoiceApiSlice';
import { useGetAllAvailableCarsQuery } from '@/redux/slices/carsApiSlice';
import { useGetAllCustomersQuery } from '@/redux/slices/customersApiSlice';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import useTranslation from "next-translate/useTranslation";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddCustomer from "@/components/MyCompo/Customers/AddCustomer";
import AddCar from "@/components/MyCompo/Cars/AddCar";
import CircularProgress from "@mui/material/CircularProgress";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const AddMwstInvoice = () => {
    const { t, lang } = useTranslation('common');
    const [addMwstInvoice,{ isLoading: creationLoading }] = useAddMwstInvoiceMutation();
    const { data: carsData } = useGetAllAvailableCarsQuery();
    const { data: customersData } = useGetAllCustomersQuery();
    const [carId, setCarId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const userData = useSelector((state) => state.auth.userData);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [cars, setCars] = useState([]);
    const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState(false);
    const [addCustomerDialogReason, setAddCustomerDialogReason] = useState('');
    const addCustomerOption = [{id: 'add_new', name: '+ '+t('act.add_new_customer'), family: '' ,nationalCode: ''}];
    const addCarOption = [{_id: 'add_new',label: '+ '+t('act.add_new_car')}];
    const [openAddCarDialog, setOpenAddCarDialog] = useState(false);
    useEffect(() => {
        if (carsData?.data) {
            setCars(carsData.data.map(car => ({ label: car.brand +" "+ car.model + " FIN: " + car.bodyNo     , _id: car.car._id })));
        }
    }, [carsData]);
    useEffect(() => {
        if (customersData?.data) {

            setCustomers(customersData.data);
        }

    }, [customersData ]);
    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
    };
    const handleOpenAddCustomerDialog = (reason) => {
        setOpenAddCustomerDialog(true);
        setAddCustomerDialogReason(reason);
    };

    const handleCloseAddCustomerDialog = () => {
        setOpenAddCustomerDialog(false);
        setAddCustomerDialogReason('');
    };
    const handleCustomerAdded = (newCustomer) => {

        console.log('newCustomer', newCustomer)
        console.log('addCustomerDialogReason', addCustomerDialogReason);
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        setCustomerId(newCustomer._id);

        handleCloseAddCustomerDialog();

    };
    const handleCarAdded = (newCar) => {
        // Update your cars list here
        setCars(prevCars => [...prevCars,
            {
                label:  " FIN: " + newCar.bodyNo + " "+t('cars.new_added_car')  ,
                _id: newCar._id
            }
        ]);
        setCarId(newCar._id);
        handleCloseAddCarDialog();
    };

    const handleOpenAddCarDialog = () => {
        setOpenAddCarDialog(true);
    };

    const handleCloseAddCarDialog = () => {
        setOpenAddCarDialog(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!carId || !customerId || !amount) {
            setErrors({ form: 'All fields are required' });
            return;
        }

        try {
            const result = await addMwstInvoice({
                car: carId,
                customer: customerId,
                price: amount,
                user: userData._id,
            });

            if (result.data.success) {
                setDialogMessage(t('invoice.invoice_created_successfully'));
                setOpenSuccessDialog(true);
                setPdfUrl(  process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')  + result.data.data  );
            }
        } catch (error) {
            console.error('Failed to add MWST invoice:', error);
        }
    };

    return (
        <Card
            sx={{
                boxShadow: "none",
                borderRadius: "10px",
                p: "25px 20px 15px",
                mb: "15px",
            }}
        >
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid container alignItems="center" spacing={2}>


                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={Boolean(errors.brand)}>
                            <Autocomplete
                                id="car-autocomplete"
                                options={ addCarOption.concat(cars)  }
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                value={ carId ? cars.find(car => car._id === carId) : null }
                                onChange={(event, newValue) => {
                                    if (newValue && newValue._id === 'add_new') {
                                        handleOpenAddCarDialog();
                                    } else {
                                        setCarId(newValue?._id || '');
                                        setErrors({...errors, buyer: ''});
                                    }
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('invoice.car')}

                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon /> {t('invoice.car')}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />


                        </FormControl>
                    </Grid>



                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={Boolean(errors.customer)}>
                            <Autocomplete
                                id="customer-autocomplete"
                                options={ addCustomerOption.concat(customers) }
                                getOptionLabel={(option) => option.name+" "+option.family+ " " + option.nationalCode}

                                value={ customerId ?  customers.find(customer => customer._id === customerId) : null }
                                onChange={(event, newValue) => {
                                    if (newValue && newValue.id === addCustomerOption[0].id) {
                                        handleOpenAddCustomerDialog('customer');
                                    } else {
                                        setCustomerId(newValue?._id || '');
                                    }
                                }}
                                renderOption={(props, option) => (
                                    <li {...props} key={option._id}>
                                        {option.name} {option.family} {option.nationalCode}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('invoice.customer')}

                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon /> {t('invoice.customer')}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />



                        </FormControl>
                    </Grid>

                    {/*<Grid item xs={12} md={6}>*/}
                    {/*    <FormControl fullWidth required>*/}
                    {/*        <InputLabel id="type-label">Type</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            labelId="type-label"*/}
                    {/*            id="type"*/}
                    {/*            value={type}*/}
                    {/*            label="Type"*/}
                    {/*            onChange={(e) => setType(e.target.value)}*/}
                    {/*        >*/}
                    {/*            <MenuItem value={'sell'}>Sell</MenuItem>*/}
                    {/*            <MenuItem value={'buy'}>Buy</MenuItem>*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

                    <Grid item xs={12} md={6}>
                        <TextField
                            label={t('invoice.amount')}
                            id="amount"
                            fullWidth
                            required
                            type="number"
                            inputProps={{
                                min: 0,
                                max: 1000000,
                                step: 500,         // Allows only whole numbers
                                inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                pattern: "[0-9]*" // Allows only digits
                            }}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {errors.form && (
                            <Typography color="error">
                                {errors.form}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={creationLoading} // Disable the button when loading
                            startIcon={creationLoading ? null : <AddCircleIcon/>} // Hide icon when loading
                        >
                            {creationLoading ?
                                <CircularProgress size={24} /> : // Show loading spinner when loading
                                t('invoice.add_mwst_invoice') // Show text otherwise
                            }
                        </Button>
                    </Grid>

                    <Grid item xs={12} height={750}>
                        {pdfUrl && (
                            <div style={{ height: '500px' }}>
                                <Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={pdfUrl} />
                                </Worker>
                            </div>
                        )}

                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={openSuccessDialog}
                onClose={handleCloseSuccessDialog}
            >
                <DialogTitle>{t('invoice.success')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                        <br /><br />
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"  style={{ display: 'flex', alignItems: 'center' }}>
                           <CloudDownloadIcon style={{ marginRight: '8px' }} /> {t('invoice.download_invoice')}
                        </a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
                        {t('act.close')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={ openAddCustomerDialog } onClose={ handleCloseAddCustomerDialog } maxWidth="md">
                <DialogTitle>{ t('act.add_new_customer') }
                    <IconButton
                        aria-label="close"
                        onClick={ handleCloseAddCustomerDialog }
                        sx={ {
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        } }
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddCustomer onCustomerAdded={ handleCustomerAdded }/>
                </DialogContent>
            </Dialog>
            <Dialog open={openAddCarDialog} onClose={handleCloseAddCarDialog} maxWidth="lg">
                <DialogTitle>{ t('act.add_new_car') }
                    <IconButton
                        aria-label="close"
                        onClick={ handleCloseAddCarDialog }
                        sx={ {
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        } }
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddCar onCarAdded={handleCarAdded} />
                </DialogContent>
            </Dialog>

        </Card>
    );
};

export default AddMwstInvoice;
