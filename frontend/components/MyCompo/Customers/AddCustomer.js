import React, {useEffect, useState} from 'react';
import {Box, Button, Card, FormControl, Grid, TextField, Typography} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useAddCustomerMutation} from '@/redux/slices/customersApiSlice'; // Adjust with your actual slice path
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation";
import FormValidationCustomer from "@/components/MyCompo/Customers/FormValidationCustomer";
import {useGetAllCountriesQuery} from "@/redux/slices/countriesApiSlice";
import {useGetStatesByCountryQuery} from "@/redux/slices/stateApiSlice";
import Autocomplete from '@mui/material/Autocomplete';


import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {customFilter ,filterOptions} from "@/components/MyCompo/Customers/CityFilter";

const AddCustomer = ({onCustomerAdded = null}) => {
        const {t, lang} = useTranslation('common');
        const [addCustomer, {isLoading}] = useAddCustomerMutation();
        const [errors, setErrors] = useState({});
        const router = useRouter();
        const [selectedCountry, setSelectedCountry] = useState(null);
        const [selectedCountryName, setSelectedCountryName] = useState(null);
        const [selectedState, setSelectedState] = useState(null);
        const [states, setStates] = useState([]); // New state for states
        const [customerType, setCustomerType] = useState('private'); // New state for customer type
        // Fetch countries
        const {data: countriesData} = useGetAllCountriesQuery();
        const countries = countriesData?.data || [];
        // Fetch states based on the selected country
        const {data: statesData} = useGetStatesByCountryQuery(selectedCountry, {
            skip: !selectedCountry, // Skip fetching if no country is selected
        });

        useEffect(() => {
            if(!selectedCountry || !statesData) return;

            // Reset the state selection when country changes
            setSelectedState(null);
            // Update the states list
            setStates(statesData.data);

        }, [selectedCountry,statesData]);

        // Function to handle country selection change
        const handleCountryChange = (event, newValue) => {
            setSelectedCountry(newValue?.isoCode || null);
            setSelectedCountryName(newValue?.name || null);

            setSelectedState(null); // Reset the state selection when country changes

        };
        const handleCustomerTypeChange = (event) => {
            setCustomerType(event.target.value);
        };
        const handleSubmit = async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const errors = FormValidationCustomer(data, selectedCountry, selectedState, t);

            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return;
            }
            try {
                const newCustomer = {
                    name: data.get('name'),
                    family: data.get('family'),
                    nationalCode: data.get('nationalCode'),
                    contactInfo: data.get('contactInfo'),
                    email: data.get('email'),
                    gender: data.get('gender'),
                    zipCode: data.get('zipcode'),
                    address: data.get('address'),
                    country: selectedCountryName,
                    city: selectedState,
                    company: false

            };
                if (customerType === 'company') {
                    newCustomer.companyName = data.get('companyName');
                    newCustomer.taxNumber = data.get('taxNumber');
                    newCustomer.company = true;
                }
                const response = await addCustomer(newCustomer);
                if (onCustomerAdded) {
                    await onCustomerAdded(response.data.data); // Call the callback if not null
                } else {
                    router.push('/customers'); // Adjust to your customers listing route
                }
            } catch (error) {
                console.error('Failed to add customer:', error);
            }
        };
        return (
            <>
                <Card
                    sx={ {
                        boxShadow: "none",
                        borderRadius: "10px",
                        p: "25px 20px 15px",
                        mb: "15px",
                    } }
                >
                    <Box component="form" noValidate onSubmit={ handleSubmit }
                         sx={ {display: 'flex', alignItems: 'center'} }>

                        <Grid container alignItems="center" spacing={ 2 }>
                            {/* Add Customer Type Radio Buttons */}
                            <Grid item xs={12} md={12}>
                                <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                    {t('customer.customer_type')}
                                </Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup row name="customerType" value={customerType} onChange={handleCustomerTypeChange}>
                                        <FormControlLabel value="private" control={<Radio />} label={t('customer.private')} />
                                        <FormControlLabel value="company" control={<Radio />} label={t('customer.company')} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {/* Conditional Rendering for Company Name and Tax Number */}
                            {customerType === 'company' && (
                                <>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="companyName"
                                            fullWidth
                                            id="companyName"
                                            label={t('customer.company_name')}
                                            // ... [additional TextField props]
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="taxNumber"
                                            fullWidth
                                            id="taxNumber"
                                            label={t('customer.tax_number')}
                                            // ... [additional TextField props]
                                        />
                                    </Grid>
                                </>
                            )}
                            {/* Gender Selection */ }
                            <Grid item xs={ 12 } md={ 12 }>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.gender') }
                                </Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup row name="gender" defaultValue="male">
                                        <FormControlLabel value="male" control={ <Radio/> } label={ t('customer.man') }/>
                                        <FormControlLabel value="female" control={ <Radio/> }
                                                          label={ t('customer.woman') }/>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {/* Customer Name */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography
                                    sx={ {
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        mb: "12px",
                                    } }
                                >
                                    { t('customer.name') }
                                </Typography>
                                <TextField
                                    name="name"
                                    fullWidth
                                    id="name"
                                    autoFocus
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.name) }
                                    helperText={ errors.name ? errors.name : " " }
                                />
                            </Grid>
                            {/* Customer Family */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.family') }
                                </Typography>
                                <TextField
                                    name="family"
                                    fullWidth
                                    id="family"
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.family) }
                                    helperText={ errors.family ? errors.family : " " }
                                />
                            </Grid>
                            {/* National Code */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.national_code') }
                                </Typography>
                                <TextField
                                    name="nationalCode"
                                    fullWidth
                                    id="nationalCode"
                                    label={ t('customer.national_code') }
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.nationalCode) }
                                    helperText={ errors.nationalCode ? errors.nationalCode : " " }
                                />
                            </Grid>
                            {/* Contact Info */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.contact_info') }
                                </Typography>
                                <TextField
                                    name="contactInfo"
                                    fullWidth
                                    id="contactInfo"
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.contactInfo) }
                                    helperText={ errors.contactInfo ? errors.contactInfo : " " }
                                />
                            </Grid>
                            {/* Email */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.email') }
                                </Typography>
                                <TextField
                                    name="email"
                                    fullWidth
                                    id="email"
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.email) }
                                    helperText={ errors.email ? errors.email : " " }
                                />
                            </Grid>
                            {/* Zipcode Field */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.zip_code') }
                                </Typography>
                                <TextField
                                    name="zipcode"
                                    fullWidth
                                    id="zipcode"
                                    placeholder={ t('customer.zip_code') }
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.zipcode) }
                                    helperText={ errors.zipcode ? errors.zipcode : " " }
                                />
                            </Grid>
                            {/* Address */ }
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.address') }
                                </Typography>
                                <TextField
                                    name="address"
                                    fullWidth
                                    id="address"
                                    InputProps={ {style: {borderRadius: 8}} }
                                    error={ Boolean(errors.address) }
                                    helperText={ errors.address ? errors.address : " " }
                                />
                            </Grid>
                            <Grid item xs={ 12 } md={4}>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.country') }
                                </Typography>
                                <FormControl fullWidth error={ Boolean(errors.country) }>
                                    <Autocomplete
                                        id="country-autocomplete"
                                        options={ countries }
                                        name="country"
                                        getOptionLabel={ (option) => option.name }
                                        onChange={ handleCountryChange }
                                        renderInput={ (params) => (
                                            <TextField { ...params }
                                                       error={ Boolean(errors.country) }
                                                       helperText={ errors.country ? errors.country : " " }
                                                       label={ t('customer.country') }
                                                       placeholder={ t('customer.country') }
                                            />
                                        ) }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={ 12 } md={4}>

                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.city') }
                                </Typography>
                                <Autocomplete
                                    id="state-autocomplete"
                                    options={ states }
                                    filterOptions={customFilter}
                                    name="state"
                                    getOptionLabel={(option) => `${option.name}, ${option.stateCode}`}
                                    renderOption={(props, option) => (
                                        <li {...props} key={`${option.name}-${option.stateCode}`}>
                                            {`${option.name}, ${option.stateCode}`}
                                        </li>
                                    )}
                                    onChange={ (event, newValue) => {
                                        setSelectedState(newValue?.name || null);

                                    } }
                                    renderInput={ (params) => (
                                        <TextField { ...params }
                                                   label={ t('customer.city') }
                                                   helperText={ errors.state ? errors.state : " " }
                                                   error={ Boolean(errors.state) }
                                                   placeholder={`${t('customer.city')} , ${t('customer.type_first_3_letters')}`}
                                                   disabled={ !selectedCountry }
                                        />
                                    ) }
                                />

                            </Grid>
                            {/* Submit Button */ }
                            <Grid item xs={ 12 } md={ 12 } textAlign="left">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={ {
                                        mt: 4,
                                        textTransform: "capitalize",
                                        borderRadius: "8px",
                                        fontWeight: "500",
                                        fontSize: "13px",
                                        padding: "12px 20px",
                                        color: "#fff !important",
                                    } }
                                >
                                    <AddCircleIcon
                                        sx={ {
                                            position: "relative",
                                            top: "-2px",
                                        } }
                                        className='mr-5px'
                                    />{ " " }
                                    { t('customer.add_customer') }
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </>
        );
    }
;
export default AddCustomer;
