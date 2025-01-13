import React, { useState } from 'react';
import {
    Box, Typography, TextField, Card, Grid, Button, FormHelperText,FormControl
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddBaseInfoMutation } from '@/redux/slices/baseInfoApiSlice';
import { useRouter } from "next/router";

const AddBaseInfo = () => {
    const [addBaseInfo, { isLoading }] = useAddBaseInfoMutation();
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const validate = (values) => {
        const errors = {};

        // For simplicity, let's require all the fields
        Object.keys(values).forEach(field => {
            if (!values[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const values = {
            address: event.currentTarget.address.value,
            eoriNumber: event.currentTarget.eoriNumber.value,
            nettoStaticText: event.currentTarget.nettoStaticText.value,
            ownerInfo: event.currentTarget.ownerInfo.value,
            taxOffice_St: event.currentTarget.taxOffice_St.value,
            taxOffice_Ust: event.currentTarget.taxOffice_Ust.value,
            IBAN: event.currentTarget.IBAN.value,
            BIC: event.currentTarget.BIC.value,
            mwstStaticText: event.currentTarget.mwstStaticText.value,
            dfzStaticText: event.currentTarget.dfzStaticText.value
        };

        const errors = validate(values);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            const response = await addBaseInfo(values);
            router.push('/baseinfo');
            console.log('Base Info added:', response.data);
        } catch (error) {
            console.error('Failed to add base info:', error);
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
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={Boolean(errors.address)}>
                            <TextField
                                name="address"
                                label="Address"
                                fullWidth
                                required
                                InputProps={{ style: { borderRadius: 8 } }}
                            />
                            {errors.address && <FormHelperText>{errors.address}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {/* ... Add other fields similarly using the TextField component ... */}
                    {/* ... E.g., for eoriNumber: */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={Boolean(errors.eoriNumber)}>
                            <TextField
                                name="eoriNumber"
                                label="EORI Number"
                                fullWidth
                                required
                                InputProps={{ style: { borderRadius: 8 } }}
                            />
                            {errors.eoriNumber && <FormHelperText>{errors.eoriNumber}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Netto Static Text
                        </Typography>
                        <TextField
                            name="nettoStaticText"
                            fullWidth
                            id="nettoStaticText"
                            label="Netto Static Text"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.nettoStaticText)}
                            helperText={errors.nettoStaticText}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Owner Information
                        </Typography>
                        <TextField
                            name="ownerInfo"
                            fullWidth
                            id="ownerInfo"
                            label="Owner Information"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.ownerInfo)}
                            helperText={errors.ownerInfo}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Tax Office (St)
                        </Typography>
                        <TextField
                            name="taxOffice_St"
                            fullWidth
                            id="taxOffice_St"
                            label="Tax Office (St)"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.taxOffice_St)}
                            helperText={errors.taxOffice_St}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Tax Office (Ust)
                        </Typography>
                        <TextField
                            name="taxOffice_Ust"
                            fullWidth
                            id="taxOffice_Ust"
                            label="Tax Office (Ust)"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.taxOffice_Ust)}
                            helperText={errors.taxOffice_Ust}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            IBAN
                        </Typography>
                        <TextField
                            name="IBAN"
                            fullWidth
                            id="IBAN"
                            label="IBAN"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.IBAN)}
                            helperText={errors.IBAN}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            BIC
                        </Typography>
                        <TextField
                            name="BIC"
                            fullWidth
                            id="BIC"
                            label="BIC"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.BIC)}
                            helperText={errors.BIC}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Mwst Static Text
                        </Typography>
                        <TextField
                            name="mwstStaticText"
                            fullWidth
                            id="mwstStaticText"
                            label="Mwst Static Text"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.mwstStaticText)}
                            helperText={errors.mwstStaticText}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            Dfz Static Text
                        </Typography>
                        <TextField
                            name="dfzStaticText"
                            fullWidth
                            id="dfzStaticText"
                            label="Dfz Static Text"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.dfzStaticText)}
                            helperText={errors.dfzStaticText}
                        />
                    </Grid>

                    {/* ... Repeat for other fields ... */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 4,
                                textTransform: "capitalize",
                                borderRadius: "8px",
                                fontWeight: "500",
                                fontSize: "13px",
                                padding: "12px 20px",
                                color: "#fff !important",
                            }}
                        >
                            <AddCircleIcon
                                sx={{ position: "relative", top: "-2px" }}
                                className='mr-5px'
                            />{" "}
                            Add Base Info
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}

export default AddBaseInfo;
