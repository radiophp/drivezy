import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Card, Grid, Button, FormHelperText,FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
    useGetBaseInfoByIdQuery,
    useUpdateBaseInfoMutation
} from '@/redux/slices/baseInfoApiSlice';
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const UpdateBaseInfo = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const [baseInfo, setBaseInfo] = useState({});
    const [errors, setErrors] = useState({});
    const { data } = useGetBaseInfoByIdQuery(id);
   // const [shopOwnerCity, setShopOwnerCity] = useState('');
    const [updateBaseInfo, {  error }] = useUpdateBaseInfoMutation();



    useEffect(() => {
        if (data) {
            setBaseInfo({
                ...data,
                invoiceNumber: data.invoiceNumber || '',
                invoiceNumberPrefix: data.invoiceNumberPrefix || ''
            });

        }
    }, [data]);



    const validate = (values) => {
        const errors = {};
        Object.keys(values).forEach(field => {
            if (!values[field] && field !== '__v' ) {

                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }

        });
        console.log(values);
        // Add validation for new fields

        // Validate invoiceNumber
        if (!values.invoiceNumber) {
            errors.invoiceNumber = t('basic_info.invoice_number_is_required');
        } else if (!/^\d+$/.test(values.invoiceNumber)) {
            errors.invoiceNumber = t('basic_info.invoice_number_is_required');
        }

        // Validate invoiceNumberPrefix
        if (!values.invoiceNumberPrefix) {
            errors.invoiceNumberPrefix = t('basic_info.invoice_number_prefix_is_required');
        } /*else if (!/^\d+$/.test(values.invoiceNumberPrefix)) {
            errors.invoiceNumberPrefix = t('basic_info.invoice_number_prefix_is_required');
        }*/
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Call validate function and get the errors
        const validationErrors = validate(baseInfo);

        if (Object.keys(validationErrors).length === 0) {
            // If no errors, proceed with form submission
            try {
                const response = await updateBaseInfo({ id: baseInfo._id, updatedBaseInfo: baseInfo });
                router.push('/basicinfo/update/653d05e98a263c6c3efe6678');
            } catch (error) {
                console.error('Failed to update base info:', error);
            }
        } else {
            // If there are errors, set them in state so they can be displayed
            setErrors(validationErrors);
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
            {/* Form structure similar to AddBaseInfo,
                 but using baseInfo values as default values for form fields */}
            {/* Example for Address field: */}
            <Box component="form" noValidate onSubmit={handleSubmit}>

                <Grid container spacing={2}>
                    {/*<Grid item xs={12} md={6}>*/}
                    {/*    <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>*/}
                    {/*        {t('basic_info.address')}*/}
                    {/*    </Typography>*/}
                    {/*    <FormControl fullWidth error={Boolean(errors.address)}>*/}
                    {/*        <TextField*/}
                    {/*            name="address"*/}

                    {/*            fullWidth*/}
                    {/*            required*/}
                    {/*            InputProps={{ style: { borderRadius: 8 } }}*/}
                    {/*            value={baseInfo.address}*/}
                    {/*            onChange={e => setBaseInfo(prevState => ({ ...prevState, address: e.target.value }))}*/}
                    {/*        />*/}
                    {/*        {errors.address && <FormHelperText>{errors.address}</FormHelperText>}*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.eori_number')}
                        </Typography>
                        <FormControl fullWidth error={Boolean(errors.eoriNumber)}>
                            <TextField
                                name="eoriNumber"

                                fullWidth
                                required
                                InputProps={{ style: { borderRadius: 8 } }}
                                value={baseInfo.eoriNumber}
                                onChange={e => setBaseInfo(prevState => ({ ...prevState, eoriNumber: e.target.value }))}
                            />
                            {errors.eoriNumber && <FormHelperText>{errors.eoriNumber}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.netto_static_text')}
                        </Typography>
                        <TextField
                            name="nettoStaticText"
                            fullWidth
                            id="nettoStaticText"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.nettoStaticText)}
                            helperText={errors.nettoStaticText}
                            value={baseInfo.nettoStaticText}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, nettoStaticText: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.owner_information')}
                        </Typography>
                        <TextField
                            name="ownerInfo"
                            fullWidth
                            id="ownerInfo"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.ownerInfo)}
                            helperText={errors.ownerInfo}
                            value={baseInfo.ownerInfo}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, ownerInfo: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.tax_office_st')}
                        </Typography>
                        <TextField
                            name="taxOffice_St"
                            fullWidth
                            id="taxOffice_St"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.taxOffice_St)}
                            helperText={errors.taxOffice_St}
                            value={baseInfo.taxOffice_St}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, taxOffice_St: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.tax_office_ust')}
                        </Typography>
                        <TextField
                            name="taxOffice_Ust"
                            fullWidth
                            id="taxOffice_Ust"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.taxOffice_Ust)}
                            helperText={errors.taxOffice_Ust}
                            value={baseInfo.taxOffice_Ust}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, taxOffice_Ust: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.iban')}
                        </Typography>
                        <TextField
                            name="IBAN"
                            fullWidth
                            id="IBAN"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.IBAN)}
                            helperText={errors.IBAN}
                            value={baseInfo.IBAN}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, IBAN: e.target.value }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.bic')}
                        </Typography>
                        <TextField
                            name="BIC"
                            fullWidth
                            id="BIC"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.BIC)}
                            helperText={errors.BIC}
                            value={baseInfo.BIC}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, BIC: e.target.value }))}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.mwst_static_text')}
                        </Typography>
                        <TextField
                            name="mwstStaticText"
                            fullWidth
                            id="mwstStaticText"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.mwstStaticText)}
                            helperText={errors.mwstStaticText}
                            value={baseInfo.mwstStaticText}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, mwstStaticText: e.target.value }))}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.dfz_static_text')}
                        </Typography>
                        <TextField
                            name="dfzStaticText"
                            fullWidth
                            id="dfzStaticText"

                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.dfzStaticText)}
                            helperText={errors.dfzStaticText}
                            value={baseInfo.dfzStaticText}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, dfzStaticText: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.commission_agreement_static_text')}
                        </Typography>
                        <TextField
                            name="comissionAgreementStaticText"
                            fullWidth
                            id="comissionAgreementStaticText"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.comissionAgreementStaticText)}
                            helperText={errors.comissionAgreementStaticText}
                            value={baseInfo.comissionAgreementStaticText}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, comissionAgreementStaticText: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}> {/* Adjust xs and md values as per your layout needs */}
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.shop_owner_country')}
                        </Typography>
                        <TextField
                            name="shopOwnerCountry"
                            fullWidth
                            value={baseInfo.shopOwnerCountry}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, shopOwnerCountry: e.target.value }))}
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            // Include any additional props you need, like error handling or specific styles
                            error={Boolean(errors.shopOwnerCountry)}
                            helperText={errors.shopOwnerCountry ? errors.shopOwnerCountry : " "}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}> {/* Adjust xs and md values as per your layout needs */}
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.shop_owner_city')}
                        </Typography>
                        <TextField
                            name="shopOwnerCity"
                            fullWidth
                            value={baseInfo.shopOwnerCity}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, shopOwnerCity: e.target.value }))}
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            // Include any additional props you need, like error handling or specific styles
                            error={Boolean(errors.shopOwnerCity)}
                            helperText={errors.shopOwnerCity ? errors.shopOwnerCity : " "}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.zip_code')}
                        </Typography>
                        <TextField
                            name="zipCode"
                            fullWidth
                            id="zipCode"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.zipCode)}
                            helperText={errors.zipCode}
                            value={baseInfo.zipCode}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, zipCode: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.street')}
                        </Typography>
                        <TextField
                            name="street"
                            fullWidth
                            id="street"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.street)}
                            helperText={errors.street}
                            value={baseInfo.street}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, street: e.target.value }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.plate_number')}
                        </Typography>
                        <TextField
                            name="plateNumber"
                            fullWidth
                            id="plateNumber"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.plateNumber)}
                            helperText={errors.plateNumber}
                            value={baseInfo.plateNumber}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, plateNumber: e.target.value }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                            {t('basic_info.shop_name')}
                        </Typography>
                        <TextField
                            name="storeName"
                            fullWidth
                            id="storeName"
                            required
                            InputProps={{ style: { borderRadius: 8 } }}
                            error={Boolean(errors.storeName)}
                            helperText={errors.storeName}
                            value={baseInfo.storeName}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, storeName: e.target.value }))}
                        />
                    </Grid>
                    {/* Grid item for invoiceNumber with error handling */}
                    <Grid item xs={12} md={6}>
                        <Typography /* ... */>
                            {t('basic_info.invoice_number')}
                        </Typography>
                        <TextField
                            name="invoiceNumber"
                            fullWidth
                            required
                            value={baseInfo.invoiceNumber}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, invoiceNumber: e.target.value }))}
                            error={Boolean(errors.invoiceNumber)}
                            helperText={errors.invoiceNumber}
                            // ... other props ...
                        />
                    </Grid>

                    {/* Grid item for invoiceNumberPrefix with error handling */}
                    <Grid item xs={12} md={6}>
                        <Typography /* ... */>
                            {t('basic_info.invoice_number_prefix')}
                        </Typography>
                        <TextField
                            name="invoiceNumberPrefix"
                            fullWidth
                            required
                            value={baseInfo.invoiceNumberPrefix}
                            onChange={e => setBaseInfo(prevState => ({ ...prevState, invoiceNumberPrefix: e.target.value }))}
                            error={Boolean(errors.invoiceNumberPrefix)}
                            helperText={errors.invoiceNumberPrefix}
                            // ... other props ...
                        />
                    </Grid>
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
                            {t('basic_info.update_basic_info')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}

export default UpdateBaseInfo;
