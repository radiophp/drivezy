import React, {useEffect, useState} from 'react';

import {
    Box, Typography, TextField, FormControl,  Select, MenuItem,  Grid, Button, InputLabel, Autocomplete
} from "@mui/material";
import Card from "@mui/material/Card";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddDealMutation } from '@/redux/slices/dealsApiSlice';
import { useGetAllCarsQuery } from '@/redux/slices/carsApiSlice';
import { useGetAllCustomersQuery } from '@/redux/slices/customersApiSlice';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
import {
    // ... (other imports)
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,

} from '@mui/material';
const AddDeal = () => {
    const [addDeal] = useAddDealMutation();
    const { data: carsData, error, isLoading } = useGetAllCarsQuery();
    const { data: customersData } = useGetAllCustomersQuery();
    const [carId, setCarId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const userData = useSelector((state) => state.auth.userData);
    const [cars, setCars] = useState([]);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);
    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
        // If you want to redirect after closing the dialog, uncomment the next line
        // router.push('/deals');
    };
    useEffect(() => {
        console.log(carsData);  // Log the entire carsData to inspect its structure
        if (carsData?.data) {
            setCars(carsData.data.map(car => ({ label: "Body NO: "+car.bodyNo + "    ---  Engine NO: "+car.engineNo, _id: car._id })));
        }
        if (error) {
            console.error("Error fetching cars:", error);  // Log error if there's an error fetching cars
        }

    }, [carsData, error, isLoading]);

    useEffect(() => {
        console.log("Cars updated", cars);
    }, [cars]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!carId || !customerId || !type || !amount) {
            setErrors({ form: 'All fields are required' });
            return;
        }

        try {
            const result =await addDeal({
                car: carId,
                customer: customerId,
                type,
                amount,
                user: userData._id,
            });
            if (result.data.success) {
                setDialogMessage(result.data.message);
                setOpenSuccessDialog(true);
                //window.open(result.data.data, '_blank');
                setPdfUrl(result.data.data);
            }
           // await router.push('/deals');
        } catch (error) {
            console.error('Failed to add deal:', error);
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
                                options={cars}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                onChange={(event, newValue) => {
                                    setCarId(newValue?._id || '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Cars"

                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon /> Car
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
                                options={customersData?.data || []}
                                getOptionLabel={(option) => option.name+" "+option.family}
                                onChange={(event, newValue) => {
                                    setCustomerId(newValue?._id || '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Customer"

                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon /> Customer
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />



                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                value={type}
                                label="Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value={'sell'}>Sell</MenuItem>
                                <MenuItem value={'buy'}>Buy</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Amount"
                            id="amount"
                            fullWidth
                            required
                            type="number"
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
                            startIcon={<AddCircleIcon />}
                        >
                            Add Deal
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
                <DialogTitle>{"Success"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                        <br /><br />
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"  style={{ display: 'flex', alignItems: 'center' }}>
                           <CloudDownloadIcon style={{ marginRight: '8px' }} /> Download Invoice
                        </a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default AddDeal;
