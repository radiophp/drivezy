import React, { useState, useEffect } from 'react';
import {Box, Typography, TextField, Grid, Button, Card, FormControl} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useUpdateCustomerMutation, useGetCustomerByIdQuery } from '@/redux/slices/customersApiSlice'; // Adjust with your actual slice path
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import FormValidationCustomer from "@/components/MyCompo/Customers/FormValidationCustomer";
import { useGetAllCountriesQuery } from "@/redux/slices/countriesApiSlice";
import { useGetStatesByCountryQuery } from "@/redux/slices/stateApiSlice";
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {customFilter ,filterOptions} from "@/components/MyCompo/Customers/CityFilter";
import Radio from "@mui/material/Radio";
const UpdateCustomer = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const customerId = router.query.id; // Assuming the ID is a URL parameter
    const [errors, setErrors] = useState({});
    const { data: customer, error, isLoading } = useGetCustomerByIdQuery(customerId, { skip: !customerId });
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation(customerId, { skip: !customerId });
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCountryName, setSelectedCountryName] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [countryIsoCode, setCountryIsoCode] = useState(null);
    const [gender, setGender] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [customerData, setCustomerData] = useState({
        name: '',
        family: '',
        nationalCode: '',
        contactInfo: '',
        email: '',
        address: '',
        country: '',
        city: ''
    });

    const [isCompany, setIsCompany] = useState(false);

    // Fetch countries
    const { data: countriesData } = useGetAllCountriesQuery();
    const countries = countriesData?.data || [];

    // Fetch states based on the selected country
    const { data: statesData } = useGetStatesByCountryQuery(countryIsoCode, {
        skip: !countryIsoCode, // Skip fetching if no country is selected
    });
    const states = statesData?.data || [];
    useEffect(() => {
        if (customer && countriesData) {
            // Existing code...

            // Example initialization (adjust based on your data structure)
            setIsCompany(customer.company || false);
            if (customer.company) {
                setCustomerData(prevState => ({
                    ...prevState,
                    companyName: customer.companyName,
                    taxNumber: customer.taxNumber
                }));
            }
        }
    }, [customer, countriesData]);

    useEffect(() => {
        if (customer && countriesData) {
            console.log("customer", customer)
            setCustomerData(customer);

            setSelectedCountry(customer.country);
            setSelectedCountryName(customer.country);
            const customerCountryIsoCode = findCountryIsoCode(customer.country, countriesData.data);
            setCountryIsoCode(customerCountryIsoCode);


            setGender(customer.gender || '');
            setZipcode(customer.zipCode || '');

        }
    }, [customer,countriesData]);
    useEffect(() => {
        if(statesData && customer){

            setSelectedState(customer.city);
        }
    }, [states,customer]);



    // Function to handle country selection change
    const handleCountryChange = (event, newValue) => {
        setSelectedCountry(newValue?.isoCode || null);
        setSelectedCountryName(newValue?.name || null);
        setSelectedState(null); // Reset the state selection when country changes
        console.log(newValue)
    };
    const findCountryIsoCode = (countryName, countriesData) => {
        if (!Array.isArray(countriesData)) {
            console.error('countriesData is not an array', countriesData);
            return null; // or you could throw an error
        }

        const country = countriesData.find(country => country.name === countryName);
        return country ? country.isoCode : null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedData = {
            ...customerData,
            company: isCompany,  // Include the 'company' flag
            gender,
            zipcode
        };
        if (isCompany ) {
            updatedData.companyName = customerData.companyName;
            updatedData.taxNumber = customerData.taxNumber;
        }

        const data = new FormData(event.currentTarget);

        const errors = FormValidationCustomer(data,selectedCountry,selectedState , t);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            console.log(errors);
            return;
        }

        try {
            await updateCustomer({ id: customerData._id, updatedCustomer:  updatedData  });
            await router.push('/customers'); // Adjust to your customers listing route
        } catch (error) {
            console.error('Failed to update customer:', error);
        }
    };
// Add handleChange function for gender and zipcode
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "gender" || name === "zipcode") {
            // If the input is gender or zipcode, set their respective state
            name === "gender" ? setGender(value) : setZipcode(value);
        } else {
            // For other fields, update customerData
            setCustomerData(prevState => ({ ...prevState, [name]: value }));
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(value);
        setCustomerData(prevState => ({ ...prevState, [name]: value }));
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error occurred: {error.message}</p>;
    }

    return (
        <>
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
                        <Grid item xs={12} md={12}>
                            <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('customer.customer_type')}
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup row name="isCompany" value={String(isCompany)} onChange={(e) => setIsCompany(e.target.value === 'true')}>
                                    <FormControlLabel value="false" control={<Radio />} label={t('customer.private')} />
                                    <FormControlLabel value="true" control={<Radio />} label={t('customer.company')} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {isCompany   && (
                            <>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="companyName"
                                        label={t('customer.company_name')}
                                        fullWidth
                                        value={customerData.companyName || ''}
                                        onChange={handleChange}
                                        // Add other necessary props
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="taxNumber"
                                        label="Tax Number"
                                        fullWidth
                                        value={customerData.taxNumber || ''}
                                        onChange={handleChange}
                                        // Add other necessary props
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Gender Selection */}
                        <Grid item xs={12} md={12}>
                            <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('customer.gender')}
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup row name="gender" value={gender} onChange={handleInputChange}>
                                    <FormControlLabel value="male" control={<Radio />} label={t('customer.man')} />
                                    <FormControlLabel value="female" control={<Radio />} label={t('customer.woman')} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {['name', 'family', 'nationalCode', 'contactInfo', 'email','address' ].map(field => (
                            <Grid item xs={12} md={4} key={field}>
                                <Typography
                                    sx={{
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        mb: "12px",
                                    }}
                                >

                                    {t('customer.'+field)}
                                </Typography>
                                <TextField
                                    name={field}
                                    fullWidth
                                    id={field}

                                    value={customerData[field]}
                                    onChange={handleChange}
                                    InputProps={{ style: { borderRadius: 8 } }}
                                    error={Boolean(errors[field] )}
                                    helperText={ errors[field] ? errors[field] : " " }
                                />

                            </Grid>
                        ))}


                        {/* Zipcode Field */}
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('customer.zip_code')}
                            </Typography>
                            <TextField
                                name="zipcode"
                                fullWidth
                                id="zipcode"
                                placeholder={t('customer.zip_code')}
                                InputProps={{ style: { borderRadius: 8 } }}
                                error={Boolean(errors.zipcode)}
                                helperText={errors.zipcode ? errors.zipcode : " "}
                                value={zipcode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {  countries && (
                                <>

                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.country' ) }
                                </Typography>
                            <FormControl fullWidth error={Boolean(errors.country )}>
                                <Autocomplete
                                    id="country-autocomplete"
                                    options={countries}
                                    name="country"
                                    value={countries.find(country => country.name === selectedCountryName) || null}
                                    getOptionLabel={(option) => option.name}
                                    onChange={handleCountryChange}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                                   error={Boolean(errors.country)}
                                                   helperText={errors.country ? errors.country : " "}
                                                   label={ t('customer.country' ) }
                                                   placeholder={ t('customer.country' ) }
                                        />
                                    )}
                                />

                            </FormControl>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {states && selectedState && (
                                <>
                                <Typography sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('customer.city' ) }
                                </Typography>
                            <Autocomplete
                                id="state-autocomplete"
                                options={states}
                                filterOptions={customFilter}
                                name="state"
                                value={states.find(state => state.name === selectedState) || null}
                                getOptionLabel={(option) => `${option.name}, ${option.stateCode}`}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                renderOption={(props, option) => (
                                    <li {...props} key={`${option.name}-${option.stateCode}`}>
                                        {`${option.name}, ${option.stateCode}`}
                                    </li>
                                )}
                                onChange={ (event, newValue) => {
                                    setSelectedState(newValue?.name || null);

                                } }
                                renderInput={(params) => (
                                    <TextField {...params}
                                               label= { t('customer.city' ) }
                                               helperText={errors.state ? errors.state : " "}
                                               error={Boolean(errors.state)}
                                               placeholder= {`${t('customer.city')} , ${t('customer.type_first_3_letters')}`}
                                               disabled={!selectedCountry}
                                    />
                                )}
                            />
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} md={12} textAlign="left">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isUpdating}
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
                                <UpdateIcon
                                    sx={{ position: "relative", top: "-2px" }}
                                    className='mr-5px'
                                />
                                {t('customer.update_customer')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
};

export default UpdateCustomer;
