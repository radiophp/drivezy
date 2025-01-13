import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';

import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Card from "@mui/material/Card";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddCarMutation, useSetCarBuyDocumentsMutation, useSetCarImagesMutation } from '@/redux/slices/carsApiSlice';
import { useGetAllBrandsQuery } from '@/redux/slices/brandsApiSlice';
import { useGetAllModelsQuery } from '@/redux/slices/modelsApiSlice';
import { useGetAllColorsQuery } from '@/redux/slices/colorsApiSlice'; // Import the colorsApiSlice
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import validateCarForm from "@/components/MyCompo/Cars/ValidateCarForm";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useDropzone } from "react-dropzone";
import styles from "@/components/Forms/FileUploader/UploadMultipleFiles.module.css";
import useTranslation from "next-translate/useTranslation";
const AddCar = ({ onCarAdded = null }) => {
    const { t, lang } = useTranslation('common');
    const [addCar, { isLoading: creationLoading }] = useAddCarMutation();
    const { data: brandsData, isLoading: brandsLoading } = useGetAllBrandsQuery();
    const { data: modelsData, isLoading: modelsLoading } = useGetAllModelsQuery();
    const { data: colorsData, isLoading: colorsLoading } = useGetAllColorsQuery();
    const [outOfList, setOutOfList] = useState(onCarAdded ? true : false);

    const [brands, setBrands] = useState([]);
    const [brandId, setBrandId] = useState('');
    const [models, setModels] = useState([]);
    const [modelId, setModelId] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [colorId, setColorId] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [firstRegistration, setFirstRegistration] = useState(null);
    const [formattedFirstRegistration, setFormattedFirstRegistration] = useState('');

    const [huauDate, setHuauDate] = useState(null);
    const [formattedHuauDate, setFormattedHuauDate] = useState("");

    const router = useRouter();
    const [selectedModel, setSelectedModel] = useState(null);
    const [setCarImages, { isLoading: isUploading }] = useSetCarImagesMutation();
    const [setCarPdf, { isLoading: isUploadingPdf }] = useSetCarBuyDocumentsMutation();
    const [files, setFiles] = useState([]);
    const [filesPdf, setFilesPdf] = useState([]);
    const [modelInput, setModelInput] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [includeTax, setIncludeTax] = useState(false);
    const [formData, setFormData] = useState({
        bodyNo: '',
        //  engineNo: '',
        mileage: '',
        //  year: '',
        buyPrice: '',
        fuelType: '',
        description: '',
        plateNo: '',
        registeredDocumentNo: '',
        HUAU: '',
        accidentalDamage: '',
        accidentalDamageDescription: '',
        firstRegistration: '',
        taxIncluded: '',
        outOfList,
        tires: '',
        tiresType: '',
        rims: '',
        rimsSize: ''
        // Add other form fields here
    });

    useEffect(() => {
        if (isUploadingPdf || isUploading || creationLoading) {
            setDisableSubmit(true);
        }
    }, [isUploadingPdf, isUploading, creationLoading]);
    useEffect(() => {
        if (brandId && models) {
            const filteredItems = models.filter(model => model.brand === brandId);
            setFilteredModels(filteredItems);
            // Check if the current input is still valid
            if (!filteredItems.some(model => model.name === selectedModel)) {
                setSelectedModel(false);
                setModelId('');
            }
        }
    }, [brandId, models]);
    useEffect(() => {
        if (brandsData?.data) {
            setBrands(brandsData.data.map(brand => ({ label: brand.name, _id: brand._id })));
        }
        if (modelsData?.data) {
            setModels(modelsData.data.map(model => ({ label: model.name, _id: model._id, brand: model.brand })));
        }
        if (colorsData?.data) {
            setColors(colorsData.data.map(color => ({ label: color.name, _id: color._id })));
        }
    }, [brandsData, modelsData, colorsData]);
    const validate = (data) => {
        return validateCarForm(t, data, brandId ? brandId : selectedBrand, modelId ? modelId : selectedModel, colorId ? colorId : selectedColor, firstRegistration, huauDate,formData.tires, formData.tiresType, formData.rims, formData.rimsSize);
    };
    const handleTaxCheckboxChange = () => {
        setIncludeTax(!includeTax);
    };
    const handleDateChange = (newValue) => {
        setFirstRegistration(newValue); // set the actual Date object or compatible format
        if (newValue) {
            const formattedDate = moment(newValue.$d).format('DD.MM.YYYY');
            setFormattedFirstRegistration(formattedDate);
        } else {
            setFormattedFirstRegistration('');
        }
    };
    // Calculate tax amount using the formula
    const taxRate = 0.19;
    const buyPrice = parseFloat(formData.buyPrice || 0);
    const netAmount = includeTax ? (buyPrice / (1 + taxRate)).toFixed(2) : '';
    const taxAmount = includeTax ? (buyPrice - netAmount).toFixed(2) : '';
    const userData = useSelector((state) => state.auth.userData);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const errors = validate(data);
        if (Object.keys(errors).length > 0) {

            setErrors(errors);
            return;
        }
        try {
            const requestBody = {
                //brand: data.get('brand'),
                brand: brandId ? brandId : selectedBrand,
                // color: data.get('color'),
                color: colorId ? colorId : selectedColor,
                // model: data.get('model'),
                model: modelId ? modelId : selectedModel,
                user: userData._id,
                // inWareHouse: data.get('inWareHouse') === 'true',
                bodyNo: data.get('bodyNo'),
                // engineNo: data.get('engineNo'),
                mileage: Number(data.get('mileage')),
                //  year: Number(data.get('year')),
                buyPrice: data.get('buyPrice'),
                taxIncluded: includeTax,
                description: data.get('description'),
                plateNo: data.get('plateNo'),
                fuelType: data.get('fuelType'),
                registeredDocumentNo: data.get('registeredDocumentNo'),
                HUAU: formattedHuauDate,
                accidentalDamage: data.get('accidentalDamage'),
                firstRegistration: formattedFirstRegistration,
                outOfList: outOfList,
                tires: data.get('tires'),
                tiresType: data.get('tiresType'),
                rims: data.get('rims'),
                rimsSize: parseFloat(data.get('rimsSize')) || 0

            };
            // Conditionally adding accidentalDamageDescription
            if (data.get('accidentalDamage') === 'yes') {
                requestBody.accidentalDamageDescription = data.get('accidentalDamageDescription');
            }
            const response = await addCar(requestBody);
            await handleUpload(response.data.data._id);
            await handleUploadPdf(response.data.data._id);
            if (onCarAdded) {
                await onCarAdded(response.data.data);
            } else {
                await router.push('/cars');
            }
        } catch (error) {
            console.error('Failed to add car:', error);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    const handleUpload = async (carId) => {
        const formData = new FormData();
        formData.append('car', carId);
        files.forEach((file) => {
            formData.append('images', file);
        });
        if (files.length === 0) return;
        try {
            const result = await setCarImages(formData).unwrap();
            // Handle the successful upload here
            console.log('Images uploaded successfully', result);
        } catch (error) {
            // Handle the error here
            console.error('Error uploading images', error);
        }
    };
    const handleUploadPdf = async (carId) => {
        const formData = new FormData();
        formData.append('car', carId);
        filesPdf.forEach((file) => {
            formData.append('files', file);
        });
        if (filesPdf.length === 0) return;
        try {
            const result = await setCarPdf(formData).unwrap();
            // Handle the successful upload here
            console.log('Files uploaded successfully', result);
        } catch (error) {
            // Handle the error here
            console.error('Error uploading Files', error);
        }
    };
    // ** Hooks
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.map((file) => Object.assign(file)));
        },
    });
    const { getRootProps: getRootPropsPdf, getInputProps: getInputPropsPdf } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFilesPdf(acceptedFiles.map((file) => Object.assign(file)));
        },
    });
    const renderFilePreview = (file) => {
        if (file.type.startsWith("image")) {
            return (
                <img
                    width={38}
                    alt={file.name}
                    src={URL.createObjectURL(file)}
                />
            );
        } else {
            return <FileCopyIcon />;
        }
    };
    const handleRemoveFile = (file) => {
        const uploadedFiles = files;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setFiles([...filtered]);
    };
    const handleRemoveFilePdf = (file) => {
        const uploadedFiles = filesPdf;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setFilesPdf([...filtered]);
    };
    const fileList = files.map((file) => (
        <ListItem
            key={file.name}
            sx={{
                border: '1px solid #eee',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px'
            }}
            className="dark-border"
        >
            <div className={styles.fileDetails}>
                <div className={styles.filePreview}>
                    {renderFilePreview(file)}
                </div>
                <div>
                    <Typography className={styles.fileName}>
                        {file.name}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveFile(file)}>
                <ClearIcon />
            </IconButton>
        </ListItem>
    ));
    const fileListPdf = filesPdf.map((file) => (
        <ListItem
            key={file.name}
            sx={{
                border: '1px solid #eee',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px'
            }}
            className="dark-border"
        >
            <div className={styles.fileDetails}>
                <div className={styles.filePreview}>
                    {renderFilePreview(file)}
                </div>
                <div>
                    <Typography className={styles.fileName}>
                        {file.name}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveFilePdf(file)}>
                <ClearIcon />
            </IconButton>
        </ListItem>
    ));
    const handleLinkClick = (event) => {
        event.preventDefault();
    };
    const handleRemoveAllFiles = () => {
        setFiles([]);
    };
    if (brandsLoading || modelsLoading || colorsLoading || creationLoading || isUploading || isUploadingPdf) return <p><CircularProgress /></p>;
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
                <Box component="form" noValidate onSubmit={handleSubmit}
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth error={Boolean(errors.brand)}>
                                <Autocomplete
                                    freeSolo
                                    id="brand-autocomplete"
                                    options={brands}
                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                    onChange={(event, newValue) => {
                                        // Handles selection from dropdown
                                        if (typeof newValue === 'string') {
                                            setSelectedBrand(newValue);
                                            setBrandId('');
                                        } else if (newValue && newValue._id) {
                                            setSelectedBrand(newValue);
                                            setBrandId(newValue._id);
                                        } else {
                                            setSelectedBrand(null);
                                            setBrandId('');
                                        }
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        // Handles typing in the input field
                                        setSelectedBrand(newInputValue);
                                        // Check if the typed value matches any of the existing brands
                                        const matchingBrand = brands.find(brand => brand.label === newInputValue);
                                        if (matchingBrand) {
                                            setBrandId(matchingBrand._id);
                                        } else {
                                            setBrandId('');
                                        }
                                    }}
                                    value={selectedBrand}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('cars.brand')}
                                            error={Boolean(errors.brand)}
                                            helperText={errors.brand}
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon /> {t('cars.brand')}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth error={Boolean(errors.model)}>
                                {filteredModels ? (<Autocomplete
                                    id="model-autocomplete"
                                    options={filteredModels}
                                    value={modelInput}
                                    noOptionsText={t('cars.there_is_no_model_for_this_brand')}
                                    getOptionLabel={(option) => {
                                        // Check if option is a string (user input) or an object (from options)
                                        if (typeof option === 'string') {
                                            return option; // Return the string as is
                                        }
                                        return option ? option.label : ''; // Return the name property of the option object or an empty string
                                    }}
                                    onChange={(event, newValue) => {
                                        // Handles selection from dropdown
                                        if (typeof newValue === 'string') {
                                            setSelectedModel(newValue);
                                            setModelInput(newValue);
                                            setModelId('');
                                        } else if (newValue && newValue._id) {
                                            setSelectedModel(newValue);
                                            setModelId(newValue._id);
                                            setModelInput(newValue ? newValue.label : '');
                                        } else {
                                            setSelectedModel(null);
                                            setModelInput('');
                                            setModelId('');
                                        }
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        // Handles typing in the input field
                                        setSelectedModel(newInputValue);
                                        setModelInput(newInputValue);
                                        // Check if the typed value matches any of the existing models
                                        const matchingModel = models.find(model => model.label === newInputValue);
                                        if (matchingModel) {
                                            setModelId(matchingModel._id);
                                        } else {
                                            setModelId('');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('cars.model')}
                                            error={Boolean(errors.model)}
                                            helperText={errors.model}
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon /> {t('cars.model')}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />)
                                    : (<p><CircularProgress /></p>)}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth error={Boolean(errors.color)}>
                                <Autocomplete
                                    freeSolo
                                    id="color-autocomplete"
                                    options={colors}
                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                    value={selectedColor}
                                    onChange={(event, newValue) => {
                                        // Handles selection from dropdown
                                        if (typeof newValue === 'string') {
                                            setSelectedColor(newValue);
                                            setColorId('');
                                        } else if (newValue && newValue._id) {
                                            setSelectedColor(newValue);
                                            setColorId(newValue._id);
                                        } else {
                                            setSelectedColor(null);
                                            setColorId('');
                                        }
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        // Handles typing in the input field
                                        setSelectedColor(newInputValue);
                                        // Check if the typed value matches any of the existing colors
                                        const matchingColor = colors.find(color => color.label === newInputValue);
                                        if (matchingColor) {
                                            setColorId(matchingColor._id);
                                        } else {
                                            setColorId('');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('cars.color')}
                                            error={Boolean(errors.color)}
                                            helperText={errors.color}
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon /> {t('cars.color')}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.body_no')}
                            </Typography>
                            <TextField
                                name="bodyNo"
                                id="bodyNo"
                                fullWidth
                                required
                                error={Boolean(errors.bodyNo)}
                                helperText={errors.bodyNo ? errors.bodyNo : " "}
                            />
                        </Grid>
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*        <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>*/}
                        {/*            {t('cars.engine_no') }*/}
                        {/*        </Typography>*/}
                        {/*        <TextField*/}
                        {/*            name="engineNo"*/}
                        {/*            id="engineNo"*/}
                        {/*            fullWidth*/}
                        {/*            required*/}
                        {/*            error={Boolean(errors.engineNo)}*/}
                        {/*            helperText={errors.engineNo ?errors.engineNo : " "}*/}
                        {/*        />*/}
                        {/*</Grid>*/}
                        {/* Mileage */}
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.mileage')}
                            </Typography>
                            <TextField
                                name="mileage"
                                fullWidth
                                id="mileage"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    max: 10000000,
                                    step: 1000,         // Allows only whole numbers
                                    inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                    pattern: "[0-9]*" // Allows only digits
                                }}
                                required
                                error={Boolean(errors.mileage)}
                                helperText={errors.mileage ? errors.mileage : t('cars.enter_a_mileage_between_0_and_1000000')}
                            />
                        </Grid>
                        {/* Year */}
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*    <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>*/}
                        {/*        {t('cars.year') }*/}
                        {/*    </Typography>*/}
                        {/*    <TextField*/}
                        {/*        name="year"*/}
                        {/*        fullWidth*/}
                        {/*        id="year"*/}
                        {/*        type="number"*/}
                        {/*        required*/}
                        {/*        error={Boolean(errors.year)}*/}
                        {/*        helperText={errors.year ? errors.year : t('cars.enter_a_year_between_1920_and') + new Date().getFullYear()}*/}
                        {/*        inputProps={{*/}
                        {/*            min: 1920,*/}
                        {/*            max: new Date().getFullYear(), // this will set the max to the current year*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/* buyPrice */}
                        {/* buyPrice */}
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px" }}>
                                {t('cars.buy_price')}
                                <span>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={includeTax}
                                                onChange={handleTaxCheckboxChange}
                                                name="includeTax"
                                                color="primary"
                                            />
                                        }
                                        label={t('cars.tax')}
                                        style={{ marginLeft: "3px" }}
                                    />
                                </span>
                                {includeTax && (
                                    <span>
                                        {t('cars.tax_amount')}: €{taxAmount} (19%)
                                    </span>
                                )}
                            </Typography>

                            <TextField
                                name="buyPrice"
                                fullWidth
                                id="buyPrice"
                                type="number"
                                required
                                inputProps={{
                                    min: 0,
                                    max: 1000000,
                                    step: 500, // Allows only whole numbers
                                    inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                    pattern: "[0-9]*", // Allows only digits
                                }}
                                error={Boolean(errors.buyPrice)}
                                helperText={errors.buyPrice ? errors.buyPrice : " "}
                                onChange={handleInputChange}
                            />


                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.tires')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.tires)}>
                                <Select
                                    labelId="tires-label"
                                    id="tires"
                                    name="tires"
                                    value={formData.tires}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.tires)}
                                >
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="4">4</MenuItem>
                                    <MenuItem value="6">6</MenuItem>
                                    <MenuItem value="8">8</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="12">12</MenuItem>
                                    <MenuItem value="18">18</MenuItem>
                                </Select>
                                {errors.tires && (
                                    <FormHelperText>{errors.tires}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.tiresType')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.tiresType)}>
                                <Select
                                    labelId="tiresType-label"
                                    id="tiresType"
                                    name="tiresType"
                                    value={formData.tiresType}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.tiresType)}
                                >
                                    <MenuItem value="winter">{t('cars.winter')}</MenuItem>
                                    <MenuItem value="summer">{t('cars.summer')}</MenuItem>
                                    <MenuItem value="all_weather">{t('cars.all_weather')}</MenuItem>
                                </Select>
                                {errors.tiresType && (
                                    <FormHelperText>{errors.tiresType}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.rims')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.rims)}>
                                <Select
                                    labelId="rims-label"
                                    id="rims"
                                    name="rims"
                                    value={formData.rims}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.rims)}
                                >
                                    <MenuItem value="steel">{t('cars.steel')}</MenuItem>
                                    <MenuItem value="alloy">{t('cars.alloy')}</MenuItem>
                                    <MenuItem value="alloy_steel">{t('cars.alloy_steel')}</MenuItem>
                                </Select>
                                {errors.rims && (
                                    <FormHelperText>{errors.rims}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.rimsSize')}
                            </Typography>
                            <TextField
                                name="rimsSize"
                                fullWidth
                                id="rimsSize"
                                type="number"
                                value={formData.rimsSize}
                                onChange={handleInputChange}
                                error={Boolean(errors.rimsSize)}
                                helperText={errors.rimsSize ? errors.rimsSize : " "}
                                inputProps={{
                                    step: "0.1"

                                }}
                            />
                        </Grid>
                        {/* Description, Plate No and inWareHouse - these are not required fields so I added them as optional */}
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.description')}
                            </Typography>
                            <TextField
                                name="description"
                                fullWidth
                                id="description"
                                error={Boolean(errors.description)}
                                helperText={errors.description ? errors.description : " "}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.plate_no')}
                            </Typography>
                            <TextField
                                name="plateNo"
                                fullWidth
                                id="plateNo"
                                error={Boolean(errors.plateNo)}
                                helperText={errors.plateNo ? errors.plateNo : " "}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.registered_document_no')}
                            </Typography>
                            <TextField
                                name="registeredDocumentNo"
                                fullWidth
                                id="registeredDocumentNo"
                                error={Boolean(errors.registeredDocumentNo)}
                                helperText={errors.registeredDocumentNo ? errors.registeredDocumentNo : " "}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.hu_au')}
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month']}
                                    inputFormat="MM.YYYY"
                                    value={huauDate}
                                    onChange={(newValue) => {
                                        setHuauDate(newValue);  // Set the Dayjs object for DatePicker

                                        if (newValue) {
                                            // Format the date and set it to the formatted state
                                            const formattedDate = newValue.format("MM.YYYY");
                                            setFormattedHuauDate(formattedDate);
                                        } else {
                                            setFormattedHuauDate('');
                                        }
                                    }}
                                    error={Boolean(errors.huauDate)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            helperText={errors.huauDate ? errors.huauDate : " "}
                                            FormHelperTextProps={{
                                                sx: { color: '#d32f2f !important', borderColor: '#d32f2f !important' },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            {/*<TextField*/}
                            {/*    name="HUAU"*/}
                            {/*    fullWidth*/}
                            {/*    id="HUAU"*/}
                            {/*    error={Boolean(errors.HUAU)}*/}
                            {/*    helperText={errors.HUAU? errors.HUAU : " "}*/}
                            {/*/>*/}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.date')}
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={firstRegistration}
                                    inputFormat="DD.MM.YYYY"
                                    onChange={handleDateChange}

                                    error={Boolean(errors.firstRegistration)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            helperText={errors.firstRegistration ? errors.firstRegistration : " "}
                                            FormHelperTextProps={{
                                                sx: { color: '#d32f2f !important', borderColor: '#d32f2f !important' },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ mt: "-18px" }}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.accidental_damage')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.accidentalDamage)}>
                                <Select
                                    labelId="accidentalDamage-label"
                                    id="accidentalDamage"
                                    name="accidentalDamage"
                                    defaultValue="" // You can set this to a default value if needed
                                    error={Boolean(errors.accidentalDamage)}
                                    onChange={handleInputChange}        // Function to handle changes
                                >
                                    <MenuItem value="yes">beschädigtes Fahrzeug</MenuItem>
                                    <MenuItem value="no">unfallfrei laut Vorbesitzer</MenuItem>
                                    <MenuItem value="repaired">reparierte Vorschäden möglich</MenuItem>
                                    <MenuItem value="unknown">{t('cars.unknown')}</MenuItem>
                                </Select>
                                {errors.accidentalDamage && (
                                    <FormHelperText>{errors.accidentalDamage}</FormHelperText> // Assuming errors.accidentalDamage has a property 'message'
                                )}
                            </FormControl>
                        </Grid>
                        {formData.accidentalDamage === 'yes' && (
                            <Grid item xs={12} md={4}>
                                <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                    {t('cars.accidental_damage_description')}
                                </Typography>
                                <TextField
                                    name="accidentalDamageDescription"
                                    fullWidth
                                    id="accidentalDamageDescription"
                                    error={Boolean(errors.accidentalDamageDescription)}
                                    helperText={errors.accidentalDamageDescription ? errors.accidentalDamageDescription : " "}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}></Grid>
                        {/* Fuel Type */}
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                {t('cars.fuel_type')}
                            </Typography>
                            <FormControl fullWidth error={Boolean(errors.fuelType)}>
                                <Select
                                    labelId="fuelType-label"
                                    id="fuelType"
                                    name="fuelType"
                                    defaultValue="" // You can set this to a default value if needed
                                    error={Boolean(errors.fuelType)}
                                >
                                    <MenuItem value="petrol">{t('cars.petrol')}</MenuItem>
                                    <MenuItem value="diesel">{t('cars.diesel')}</MenuItem>
                                    <MenuItem value="electric">{t('cars.electric')}</MenuItem>
                                    <MenuItem
                                        value="hybrid_petrol_electric">{t('cars.hybrid_petrol_electric')}</MenuItem>
                                    <MenuItem
                                        value="hybrid_diesel_electric">{t('cars.hybrid_diesel_electric')}</MenuItem>
                                    <MenuItem value="natural_gas_cng">{t('cars.natural_gas_cng')}</MenuItem>
                                    <MenuItem value="autogas_lpg">{t('cars.autogas_lpg')}</MenuItem>
                                    <MenuItem value="hydrogen">{t('cars.hydrogen')}</MenuItem>
                                    <MenuItem value="ethanol_e85">{t('cars.ethanol_e85')}</MenuItem>
                                </Select>
                                {errors.fuelType && (
                                    <FormHelperText>{errors.fuelType}</FormHelperText>  // Assuming errors.fuelType has a property 'message'
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={outOfList}
                                        onChange={(e) => setOutOfList(e.target.checked)}
                                        name="outOfList"
                                    />
                                }
                                label={t('cars.out_of_list')}
                            />
                        </Grid>
                        {/*<Grid item xs={12} md={4}>*/}
                        {/*    <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>*/}
                        {/*        In Ware House*/}
                        {/*    </Typography>*/}
                        {/*    <FormControlLabel*/}
                        {/*        control={*/}
                        {/*            <Checkbox*/}
                        {/*                name="inWareHouse"*/}
                        {/*                color="primary"*/}
                        {/*            />*/}
                        {/*        }*/}
                        {/*        label="Yes"*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid item xs={12}
                            sx={{
                                boxShadow: "none",
                                borderRadius: "10px",
                                p: "25px",
                                mb: "15px",
                            }}
                            xs={12}
                        >
                            <Typography
                                as="h3"
                                sx={{
                                    fontSize: 18,
                                    fontWeight: 500,
                                    mb: "15px",
                                }}
                            >
                                {t('cars.upload_multiple_Files')}
                                <hr />
                            </Typography>
                            <div {...getRootPropsPdf()} className={styles.dropzone}>
                                <input {...getInputPropsPdf()} accept=".doc,.docx,.pdf,.jpg,.jpeg" />
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: ["column", "column", "row"],
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            textAlign: ["center", "center", "inherit"],
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="500" mb={1}>
                                            {t('cars.upload_multiple_Files')}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {t('cars.drop_files_here_or_click_to_upload')}{" "}
                                            <Link href="/" onClick={handleLinkClick}>
                                                {t('act.browse')}
                                            </Link>{" "}
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            {filesPdf.length ? (
                                <Fragment>
                                    <List>{fileListPdf}</List>
                                </Fragment>
                            ) : null}
                        </Grid>
                        {onCarAdded == null && (
                            <Grid item xs={12}
                                sx={{
                                    boxShadow: "none",
                                    borderRadius: "10px",
                                    p: "25px",
                                    mb: "15px",
                                }}
                            >
                                <Typography
                                    as="h3"
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 500,
                                        mb: "15px",
                                    }}
                                >
                                    {t('cars.upload_multiple_images')}
                                    <hr />
                                </Typography>
                                <div {...getRootProps()} className={styles.dropzone}>
                                    <input {...getInputProps()} accept=".jpg,.jpeg,.png,.gif,.webp" />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: ["column", "column", "row"],
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                textAlign: ["center", "center", "inherit"],
                                            }}
                                        >
                                            <Typography variant="h5" fontWeight="500" mb={1}>
                                                {t('cars.upload_multiple_images')}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {t('cars.drop_files_here_or_click_to_upload')}{" "}
                                                <Link href="/" onClick={handleLinkClick}>
                                                    {t('act.browse')}
                                                </Link>{" "}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </div>
                                {files.length ? (
                                    <Fragment>
                                        <List>{fileList}</List>
                                    </Fragment>
                                ) : null}
                            </Grid>
                        )}
                        {/* Submit Button */}
                        <Grid item xs={12} md={12} textAlign="left">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    mb: 5,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "13px",
                                    padding: "12px 20px",
                                    color: "#fff !important",
                                }}
                                disabled={disableSubmit} // Disable the button when loading
                                startIcon={disableSubmit ? null : <AddCircleIcon />} // Hide icon when loading
                            >
                                {disableSubmit ?
                                    <CircularProgress size={24} /> : // Show loading spinner when loading
                                    t('cars.add_car') // Show text otherwise
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
}
export default AddCar;
