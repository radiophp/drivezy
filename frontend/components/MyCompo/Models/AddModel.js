import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddModelMutation } from '@/redux/slices/modelsApiSlice';
import { useGetAllBrandsQuery } from '@/redux/slices/brandsApiSlice';
import { useRouter } from "next/router";
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import useTranslation from "next-translate/useTranslation";
const AddModel = () => {
    const { t, lang } = useTranslation('common');
    const [addModel, { isLoading }] = useAddModelMutation();
    const { data: brandsData } = useGetAllBrandsQuery();
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [brandId, setBrandId] = useState('');

    useEffect(() => {
        if (brandsData?.data) {
            setBrands(brandsData.data.map(brand => ({ label: brand.name, _id: brand._id })));
        }
    }, [brandsData]);
    const validate = (modelName, brandId) => {
        const errors = {};

        if (!modelName) {
            errors.modelName = "Model name is required";
        }

        console.log("Validating Brand ID:", brandId); // Add this line to log brand ID during validation
        if (!brandId) {
            errors.brand = "Brand is required";
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const modelName = event.currentTarget.modelName.value;

        const errors = validate(modelName, brandId);  // Changed this line to use brandId directly from state
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            const response = await addModel({ name: modelName, brand: brandId });
            router.push('/models');
            console.log('Model added:', response.data);
        } catch (error) {
            console.error('Failed to add model:', error);
        }
    };

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
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.model')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.modelName)}>
                                <TextField
                                    name="modelName"
                                    fullWidth
                                    id="modelName"

                                    autoFocus
                                    required
                                    InputProps={{ style: { borderRadius: 8 } }}
                                />
                                {errors.modelName && <FormHelperText>{errors.modelName}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.brand')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.brand)}>
                                <Autocomplete
                                    id="brand-autocomplete"
                                    options={brands}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(event, newValue) => {
                                        setBrandId(newValue?._id || ''); // setBrandId needs to be defined to update the state
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}

                                            error={Boolean(errors.brand)}
                                            helperText={errors.brand}
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4} textAlign="left">
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
                                {t('act.add')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
}

export default AddModel;
