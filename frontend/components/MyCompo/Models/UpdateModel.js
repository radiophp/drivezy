import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, FormHelperText, MenuItem, Select, TextField, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {useGetModelByIdQuery, useUpdateModelMutation} from '@/redux/slices/modelsApiSlice';
import {useGetAllBrandsQuery} from '@/redux/slices/brandsApiSlice';
import {useRouter} from "next/router";
import SendIcon from "@mui/icons-material/Send";
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import useTranslation from "next-translate/useTranslation";

const UpdateModel = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const { data: model, error, isLoading } = useGetModelByIdQuery(id, { skip: !id });
    const { data: brandsData } = useGetAllBrandsQuery();

    const [modelName, setModelName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({});

    const [updateModel, { isLoading: isUpdating }] = useUpdateModelMutation();

    useEffect(() => {
        if (model) {
            setModelName(model.name);
            if (brands.length > 0) {
                setSelectedBrand(brands.find(brand => brand._id === model.brand._id));
            }
        }
    }, [model, brandsData]);

        useEffect(() => {
            if (model && brandsData?.data) {
                setModelName(model.name);
                const formattedBrands = brandsData.data.map(brand => ({ label: brand.name, _id: brand._id }));
                setBrands(formattedBrands);

                // This line ensures that the correct brand object is selected based on the brand ID from the model
                const selectedBrandLable = formattedBrands.find(brand => brand._id === model.brand);
                 // Add this line to log the selected brand
                if (selectedBrandLable) {
                    setSelectedBrand(selectedBrandLable);  // Ensure that the selected brand is an object with label and _id
                    console.log("selectedBrand:", selectedBrand);
                } else {
                    console.error('Brand not found:', model.brand);
                    setSelectedBrand(null);  // Make sure it's not undefined, set to null if brand not found
                }
            }
        }, [model, brandsData]);




    const validate = (name, brand) => {
        const errors = {};

        if (!name) {
            errors.modelName = 'Model name is required';
        }

        if (!brand) {
            errors.brand = 'Brand is required';
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validate(modelName, selectedBrand);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            await updateModel({ id, updatedModel: { name: modelName, brand: selectedBrand._id } });
            console.log('Model updated');
            router.push('/models');
        } catch (error) {
            console.error('Failed to update model:', error);
        }
    };

    if (isLoading|| !brands.length) return <p>Loading...</p>;
    if (error) return <p>Error occurred: {error.message}</p>;

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
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                {t('cars.model')}
                            </Typography>
                            <FormControl fullWidth error={ Boolean(errors.modelName) }  >
                                <TextField

                                    value={ modelName }
                                    onChange={ (e) => setModelName(e.target.value) }
                                    required
                                />
                                { errors.modelName && <FormHelperText>{ errors.modelName }</FormHelperText> }
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.brand')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.brand)}>
                                {selectedBrand  ? (
                                    <Autocomplete
                                        id="brand-autocomplete"
                                        options={brands}
                                        value={selectedBrand}
                                        getOptionLabel={(option) => option.label}
                                        onChange={(event, newValue) => {
                                            setSelectedBrand(newValue ?? null);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Brand"
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
                                ) : (
                                    <CircularProgress size={25} />
                                )}
                                {errors.brand && <FormHelperText>{errors.brand}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={ 12 } md={ 4 } textAlign="left">
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
                                disabled={ isUpdating }
                                startIcon={ <SendIcon/> }

                            >
                                {t('act.update')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
};

export default UpdateModel;
