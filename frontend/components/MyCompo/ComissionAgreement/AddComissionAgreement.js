import React, {useEffect, useState} from 'react';

import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import Card from "@mui/material/Card";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for the loading spinner
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useGetAllAvailableCarsQuery} from '@/redux/slices/carsApiSlice';
import {useGetAllCustomersQuery} from '@/redux/slices/customersApiSlice';
import {useCreateComissionAgreementMutation} from '@/redux/slices/comissionAgreementApiSlice';
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import useTranslation from "next-translate/useTranslation";
import AddCustomer from "@/components/MyCompo/Customers/AddCustomer";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCar from "@/components/MyCompo/Cars/AddCar";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${ pdfjsLib.version }/build/pdf.worker.min.js`;
const AddComissionAgreement = () => {
    const {t, lang} = useTranslation('common');
    // Local state for form inputs
    const [buyerId, setBuyerId] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [carId, setCarId] = useState('');
    const [price, setPrice] = useState('');
    const [paymentMethodDeposit, setPaymentMethodDeposit] = useState('');
    const [priceDeposit, setPriceDeposit] = useState('');
    const [buyWithNoWarrantyGuaranty, setBuyWithNoWarrantyGuaranty] = useState(false);
    const [noReturn, setNoReturn] = useState(false);
    const [salesTakePlace, setSalesTakePlace] = useState(false);
    const [differentTax, setDifferentTax] = useState(false);
    const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState(false);
    const [addCustomerDialogReason, setAddCustomerDialogReason] = useState('');
    const addCustomerOption = [{id: 'add_new', name: '+ '+t('act.add_new_customer'), family: '' ,nationalCode: ''}];
    const addCarOption = [{_id: 'add_new',label: '+ '+t('act.add_new_car')}];
    const [openAddCarDialog, setOpenAddCarDialog] = useState(false);

    const [handOverToBuyer, setHandOverToBuyer] = useState({
        KFZBrief: false,
        Fahrzeugschein: false,
        Hauptuntersuchung: false,
        Schlüssel: 0,
        description: ''
    });
    const [inGermany, setInGermany] = useState(false);

    ////my
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const userData = useSelector((state) => state.auth.userData);
    const [cars, setCars] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);
    const {data: carsData, error, isLoading} = useGetAllAvailableCarsQuery();
    const {data: customersData} = useGetAllCustomersQuery();

    const [customerId, setCustomerId] = useState('');
    // ... other state variables for each field

    // This part of the state is for managing form submission and response
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Redux hook for dispatching the add comission agreement action
    const [addComissionAgreement ,{ isLoading: creationLoading }] = useCreateComissionAgreementMutation();

    // Accessing the current user data from the Redux store
    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
        // If you want to redirect after closing the dialog, uncomment the next line
        // router.push('/deals');
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

        if(addCustomerDialogReason === 'buyer')
        {
            setBuyerId(newCustomer._id);
            if(newCustomer?.country === 'Germany' || newCustomer?.country === 'Deutschland' ){
                setInGermany(true);
            }
        }
        else if(addCustomerDialogReason === 'seller')
            setSellerId(newCustomer._id);
        handleCloseAddCustomerDialog();

    };
    const handleCarAdded = (newCar) => {
        // Update your cars list here
        newCar = newCar ? newCar : {};
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

    useEffect(() => {

        if (carsData?.data) {
            setCars(carsData.data.map(car => ({ label: car.brand +" "+ car.model + " FIN: " + car.bodyNo     , _id: car.car._id })));
        }
        if (error) {
            console.error("Error fetching cars:", error);  // Log error if there's an error fetching cars
        }

    }, [carsData, error, isLoading]);
    useEffect(() => {
        if (customersData?.data) {

            setCustomers(customersData.data);
        }
        if (error) {
            console.error("Error fetching customers:", error);  // Log error if there's an error fetching customers

        }
    }, [customersData, error, isLoading]);


    const handleHandOverChange = (field, value) => {
        setHandOverToBuyer({...handOverToBuyer, [field]: value});
    };
    const validateFields = ({sellerId, buyerId, carId, price,paymentMethodDeposit, description}) => {
        const errors = {};

        if (!sellerId) {
            errors.seller = t('invoice.seller_is_required');
        }
        if (!buyerId) {
            errors.buyer = t('invoice.buyer_is_required');
        }
        if (!carId) {
            errors.car = t('invoice.car_is_required');
        }
        if (!price) {
            errors.price = t('invoice.price_is_required');
        } else if (isNaN(price) || parseFloat(price) <= 0) {
            errors.price = t('invoice.price_must_be_a_positive_number');
        }
        if (!description.trim()) {
            errors.description = t('invoice.description_is_required');
        }

        return errors;
    };

    // Handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Extract form data from state
        const formData = {
           sellerId,
            buyerId,
            carId,
            price,
            priceDeposit,
            paymentMethodDeposit,
            description: handOverToBuyer.description,
        };

        // Validate fields
        const newErrors = validateFields(formData);
        setErrors(newErrors);

        // Check for any errors before proceeding
        const hasErrors = Object.keys(newErrors).length > 0;
        if (hasErrors) {
            // Handle the presence of errors, such as displaying them to the user
            return;
        }
        // Construct the agreement data from the local state
        const agreementData = {
            buyer: buyerId,
         //   seller: '656ad998723358ab2961b223',
            seller:  sellerId,
            car: carId,
            user: userData._id,
            price: price,
            priceDeposit: priceDeposit,
            paymentMethodDeposit: paymentMethodDeposit,
            buyWithNoWarrantyGuaranty: buyWithNoWarrantyGuaranty,
            noReturn: noReturn,
            salesTakePlace: salesTakePlace,
            differentTax: differentTax,
            KFZBrief: handOverToBuyer.KFZBrief,
            Fahrzeugschein: handOverToBuyer.Fahrzeugschein,
            Hauptuntersuchung: handOverToBuyer.Hauptuntersuchung,
            Schlüssel: handOverToBuyer.Schlüssel,
            description: handOverToBuyer.description,
            inGermany: inGermany,
        };

        try {
            // Use the addComissionAgreement mutation hook to send the post request
            const response = await addComissionAgreement(agreementData).unwrap();

            // Handle the response accordingly
            if (response.success) {

                setSubmitSuccess(true);
                setDialogMessage(t('invoice.invoice_created_successfully'));
                setOpenSuccessDialog(true);

                //window.open(result.data.data, '_blank');
                setPdfUrl(process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '') + response.data);
            } else {
                setSubmitError(response.message || 'An error occurred');
            }
        } catch (error) {
            setSubmitError(error.message || 'An error occurred');
        }
    };

    return (
        <Card
            sx={ {
                boxShadow: "none",
                borderRadius: "10px",
                p: "25px 20px 15px",
                mb: "15px",
            } }
        >
            <Box component="form" noValidate onSubmit={ handleSubmit } sx={ {display: 'flex', alignItems: 'center'} }>
                <Grid container alignItems="center" spacing={ 2 }>
                    {/* Seller Autocomplete Input */ }
                    <Grid item xs={ 12 } md={ 6 }>
                        <FormControl fullWidth>
                            <Autocomplete
                                id="seller-autocomplete"
                                options={ addCustomerOption.concat(customers) }
                                getOptionLabel={ (option) => option.name + " " + option.family + " " + option.nationalCode }
                                value={ sellerId ? customers.find(customer => customer._id === sellerId) : null }
                                onChange={ (event, newValue) => {

                                    if (newValue && newValue.id === addCustomerOption[0].id) {
                                        handleOpenAddCustomerDialog('seller');
                                    } else {
                                        setSellerId(newValue?._id || '');
                                    }
                                } }
                                renderOption={(props, option) => (
                                    <li {...props} key={option._id}>
                                        {option.name} {option.family} {option.nationalCode}
                                    </li>
                                )}
                                renderInput={ (params) => (
                                    <TextField
                                        { ...params }
                                        label={ t('invoice.seller') }
                                        required
                                        error={ Boolean(errors.seller) }
                                        InputProps={ {
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon/> { t('invoice.seller') }
                                                </InputAdornment>
                                            ),
                                        } }
                                    />
                                ) }
                            />
                        </FormControl>
                        <FormHelperText error>{ errors.seller ? errors.seller : " " }</FormHelperText>
                    </Grid>

                    {/* Buyer Autocomplete Input */ }
                    <Grid item xs={ 12 } md={ 6 }>
                        <FormControl fullWidth>
                            <Autocomplete
                                id="buyer-autocomplete"
                                options={ addCustomerOption.concat(customers) }
                                getOptionLabel={ (option) => option.name + " " + option.family + " " + option.nationalCode }
                                value={ buyerId ? customers.find(customer => customer._id === buyerId) : null }
                                onChange={ (event, newValue) => {
                                    if (newValue && newValue.id === addCustomerOption[0].id) {
                                        handleOpenAddCustomerDialog( 'buyer');
                                    } else {
                                        setBuyerId(newValue?._id || '');// handle normal selection

                                        if(newValue?.country === 'Germany' || newValue?.country === 'Deutschland' ){
                                            setInGermany(true);
                                        }
                                    }

                                } }
                                renderInput={ (params) => (
                                    <TextField
                                        { ...params }
                                        label={ t('invoice.buyer') }
                                        required
                                        error={ Boolean(errors.buyer) }
                                        InputProps={ {
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon/> { t('invoice.buyer') }
                                                </InputAdornment>
                                            ),
                                        } }
                                    />
                                ) }
                            />
                        </FormControl>
                        <FormHelperText error>{ errors.buyer ? errors.buyer : " " }</FormHelperText>
                    </Grid>

                    {/* Price Input */ }
                    <Grid item xs={ 12 } md={ 6 } >
                        <TextField
                            label={ t('invoice.price') }
                            id="price"
                            fullWidth
                            required
                            type="number"
                            value={ price }
                            inputProps={{
                                min: 0,
                                max: 1000000,
                                step: 500,         // Allows only whole numbers
                                inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                pattern: "[0-9]*" // Allows only digits
                            }}
                            onChange={ (e) => setPrice(e.target.value) }
                            error={ Boolean(errors.price) }
                            sx={ {mt: 0} }
                        />
                        <FormHelperText error>{ errors.price ? errors.price : " " }</FormHelperText>
                    </Grid>
                    {/* car */ }
                    <Grid item xs={ 12 } md={ 6 }>
                        <FormControl fullWidth error={ Boolean(errors.brand) }>
                            <Autocomplete
                                id="car-autocomplete"
                                options={ addCarOption.concat(cars)  }
                                getOptionLabel={ (option) => option.label }
                                error={ Boolean(errors.car) }
                                helpertext={ errors.car }
                                isOptionEqualToValue={ (option, value) => option._id === value._id }

                                value={ carId ? cars.find(car => car._id === carId) : null }
                                onChange={ (event, newValue) => {
                                    if (newValue && newValue._id === 'add_new') {

                                        handleOpenAddCarDialog();
                                    } else {
                                        setCarId(newValue?._id || '');
                                        setErrors({...errors, buyer: ''});
                                    }

                                } }
                                renderInput={ (params) => (
                                    <TextField
                                        { ...params }
                                        label={ t('invoice.car') }
                                        error={ Boolean(errors.car) }
                                        required
                                        InputProps={ {
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon/> { t('invoice.car') }
                                                </InputAdornment>
                                            ),
                                        } }
                                    />
                                ) }
                            />
                            <FormHelperText error> { errors.car ? errors.car : " " }</FormHelperText>

                        </FormControl>
                    </Grid>
                    <Grid item xs={ 12 } md={ 6 } >
                        <TextField
                            label={ t('invoice.deposit_price') }
                            id="priceDeposit"
                            fullWidth
                            required
                            type="number"
                            value={ priceDeposit }
                            inputProps={{
                                min: 0,
                                max: 1000000,
                                defaultValue: 0,
                                step: 500,         // Allows only whole numbers
                                inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                pattern: "[0-9]*" // Allows only digits
                            }}
                            onChange={ (e) => setPriceDeposit(e.target.value) }
                            error={ Boolean(errors.priceDeposit) }
                            sx={ {mt: 0} }
                        />
                        <FormHelperText error>{ errors.priceDeposit ? errors.priceDeposit : " " }</FormHelperText>
                    </Grid>
                    {/* deposit Type Input */ }
                    <Grid item xs={ 12 } md={ 6 }>
                        <FormControl fullWidth required>
                            <InputLabel id="paymentMethodDeposit-label">{ t('invoice.payment_method_deposit') }</InputLabel>
                            <Select
                                labelId="paymentMethodDeposit-label"
                                id="paymentMethodDeposit"
                                value={ paymentMethodDeposit }
                                label="Payment Method Deposite"
                                error={ Boolean(errors.paymentMethodDeposit) }
                                onChange={ (e) => setPaymentMethodDeposit(e.target.value) }
                            >
                                <MenuItem value={ 'bar' }>Bar</MenuItem>
                                <MenuItem value={ 'iban' }>IBAN</MenuItem>

                            </Select>
                        </FormControl>
                        <FormHelperText error>{ errors.paymentMethodDeposit ? errors.paymentMethodDeposit : " " }</FormHelperText>
                    </Grid>



                    {/* Fields for handOverToBuyer */ }
                    <Grid item xs={ 12 } sm={ 12 }>
                        <Typography variant="h6">{ t('invoice.handover_to_buyer') }</Typography>
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            fullWidth
                            type="number"
                            label="Schlüssel"
                            inputProps={{
                                min: 0,
                                max: 1000000,
                                step: 500,         // Allows only whole numbers
                                inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                pattern: "[0-9]*" // Allows only digits
                            }}
                            value={ handOverToBuyer.Schlüssel }
                            onChange={ (e) => handleHandOverChange('Schlüssel', e.target.value) }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            fullWidth
                            multiline
                            label="Beschreibung"
                            sx={ {mt: 2} }
                            error={ Boolean(errors.description) }
                            value={ handOverToBuyer.description }
                            onChange={ (e) => handleHandOverChange('description', e.target.value) }
                        />
                        <FormHelperText error>{ errors.description ? errors.description : " " }</FormHelperText>
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ handOverToBuyer.KFZBrief }
                                    onChange={ (e) => handleHandOverChange('KFZBrief', e.target.checked) }
                                />
                            }
                            label="KFZ-Brief"
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ handOverToBuyer.Fahrzeugschein }
                                    onChange={ (e) => handleHandOverChange('Fahrzeugschein', e.target.checked) }
                                />
                            }
                            label="Fahrzeugschein"
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ handOverToBuyer.Hauptuntersuchung }
                                    onChange={ (e) => handleHandOverChange('Hauptuntersuchung', e.target.checked) }
                                />
                            }
                            label="Hauptuntersuchung"
                        />
                    </Grid>
                    {/* Checkbox fields */ }
                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ buyWithNoWarrantyGuaranty }
                                    onChange={ (e) => setBuyWithNoWarrantyGuaranty(e.target.checked) }
                                />
                            }
                            label="Gekauft wie gesehen, unter Ausschluss jeglicher Gewährleistung und Garantie"
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ noReturn }
                                    onChange={ (e) => setNoReturn(e.target.checked) }
                                />
                            }
                            label="Im Kundenauftrag, keine Gewährleistung und Garantie sowie Rücknahme"
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ salesTakePlace }
                                    onChange={ (e) => setSalesTakePlace(e.target.checked) }
                                />
                            }
                            label="Verkauf erfolgt nach Export, unter Ausschluss jeglicher Gewährleistung und Garantie"
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 }>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ differentTax }
                                    onChange={ (e) => setDifferentTax(e.target.checked) }
                                />
                            }
                            label="Differenzbesteuerung nach § 25a"
                        />
                    </Grid>


                    <Grid item xs={ 12 } sm={ 6 }>
                        { errors.form && (
                            <Typography color="error">
                                { errors.form }
                            </Typography>
                        ) }
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
                                t('invoice.add_commission_agreement') // Show text otherwise
                            }
                        </Button>
                    </Grid>
                    <Grid item xs={ 12 } height={ 750 }>
                        { pdfUrl && (
                            <div style={ {height: '500px'} }>
                                <Worker
                                    workerUrl={ `//unpkg.com/pdfjs-dist@${ pdfjsLib.version }/build/pdf.worker.min.js` }>
                                    <Viewer fileUrl={ pdfUrl }/>
                                </Worker>
                            </div>
                        ) }

                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={ openSuccessDialog }
                onClose={ handleCloseSuccessDialog }
            >
                <DialogTitle>{ t('invoice.success') }

                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { dialogMessage }
                        <br/><br/>
                        <a href={ pdfUrl } target="_blank" rel="noopener noreferrer"
                           style={ {display: 'flex', alignItems: 'center'} }>
                            <CloudDownloadIcon style={ {marginRight: '8px'} }/> { t('invoice.download_invoice') }
                        </a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleCloseSuccessDialog } color="primary" autoFocus>
                        { t('act.close') }
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

export default AddComissionAgreement;
