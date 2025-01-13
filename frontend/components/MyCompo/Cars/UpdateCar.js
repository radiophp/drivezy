import React, {Fragment, useEffect, useState} from 'react';
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
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {
    useDeleteCarImageMutation,
    useGetCarByIdQuery,
    useSetCarBuyDocumentsMutation,
    useSetCarImagesMutation,
    useUpdateCarMutation
} from '@/redux/slices/carsApiSlice';
import {useGetAllBrandsQuery} from '@/redux/slices/brandsApiSlice';
import {useGetAllModelsQuery} from '@/redux/slices/modelsApiSlice';
import {useGetAllColorsQuery} from '@/redux/slices/colorsApiSlice';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {useDropzone} from "react-dropzone";
import styles from "@/components/Forms/FileUploader/UploadMultipleFiles.module.css";
import Image from 'next/image'; // Correct import of Image from Next.js
import validateCarForm from "@/components/MyCompo/Cars/ValidateCarForm";
import useTranslation from "next-translate/useTranslation";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import moment from "moment/moment";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const UpdateCar = () => {
    const {t, lang} = useTranslation('common');
    const {data: brandsData, isLoading: brandsLoading} = useGetAllBrandsQuery();
    const {data: modelsData, isLoading: modelsLoading} = useGetAllModelsQuery();
    const {data: colorsData, isLoading: colorsLoading} = useGetAllColorsQuery();
    const [deleteCarImage] = useDeleteCarImageMutation();
    const [outOfList, setOutOfList] = useState( false);
    const [brands, setBrands] = useState([]);
    const [brandId, setBrandId] = useState('');
    const [models, setModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [modelId, setModelId] = useState('');
    const [colors, setColors] = useState([]);
    const [colorId, setColorId] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [firstRegistration, setFirstRegistration] = React.useState(null);
    const [formattedFirstRegistration, setFormattedFirstRegistration] = useState('');
    const [huauDate, setHuauDate] = useState(null);
    const [formattedHuauDate, setFormattedHuauDate] = useState("");
    const {id: carId} = router.query;
    const [updateCar, {isLoading}] = useUpdateCarMutation(carId, {skip: !carId});
    const [setCarImages, {isLoading: isUploading}] = useSetCarImagesMutation();
    const [setCarPdf, {isLoading: isUploadingPdf}] = useSetCarBuyDocumentsMutation();
    const [files, setFiles] = useState([]);
    const [filesPdf, setFilesPdf] = useState([]);
    const [lastImages, setLastImages] = useState(false);
    const [lastFiles, setLastFiles] = useState(false);
    const [includeTax, setIncludeTax] = useState(false);
    const handleDeleteImage = async (imageName) => {
        try {
            const response = await deleteCarImage({car: carId, image: imageName}).unwrap();
            if (response.success) {
                setLastImages(response.data?.image?.length === 0 ? false : response.data.image);
            }
            // Handle successful deletion
            // Consider updating local state to immediately reflect the change
        } catch (error) {
            // Handle error
            console.error('Error deleting image', error);
        }
    };
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('car', carId);
        files.forEach((file) => {
            formData.append('images', file);
        });
        if (files.length === 0) return;
        if (files.length) {
            try {
                const result = await setCarImages(formData).unwrap();
                // Handle the successful upload here
                console.log('Images uploaded successfully', result);
            } catch (error) {
                // Handle the error here
                console.error('Error uploading images', error);
            }
        }
    };
    const handleUploadPdf = async () => {
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
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.map((file) => Object.assign(file)));
        },
    });
    const {getRootProps: getRootPropsPdf, getInputProps: getInputPropsPdf} = useDropzone({
        onDrop: (acceptedFiles) => {
            setFilesPdf(acceptedFiles.map((file) => Object.assign(file)));
        },
    });
    const renderFilePreview = (file) => {
        if (file.type.startsWith("image")) {
            return (
                <img
                    width={ 38 }
                    alt={ file.name }
                    src={ URL.createObjectURL(file) }
                />
            );
        } else {
            return <FileCopyIcon/>;
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
            key={ file.name }
            sx={ {
                border: '1px solid #eee',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px'
            } }
            className="dark-border"
        >
            <div className={ styles.fileDetails }>
                <div className={ styles.filePreview }>
                    { renderFilePreview(file) }
                </div>
                <div>
                    <Typography className={ styles.fileName }>
                        { file.name }
                    </Typography>
                </div>
            </div>
            <IconButton onClick={ () => handleRemoveFile(file) }>
                <ClearIcon/>
            </IconButton>
        </ListItem>
    ));
    const fileListPdf = filesPdf.map((file) => (
        <ListItem
            key={ file.name }
            sx={ {
                border: '1px solid #eee',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px'
            } }
            className="dark-border"
        >
            <div className={ styles.fileDetails }>
                <div className={ styles.filePreview }>
                    { renderFilePreview(file) }
                </div>
                <div>
                    <Typography className={ styles.fileName }>
                        { file.name }
                    </Typography>
                </div>
            </div>
            <IconButton onClick={ () => handleRemoveFilePdf(file) }>
                <ClearIcon/>
            </IconButton>
        </ListItem>
    ));
    const handleLinkClick = (event) => {
        event.preventDefault();
    };
    const handleRemoveAllFiles = () => {
        setFiles([]);
    };
    // Fetching the car data by ID
    const {data: carData, isLoading: carsLoading} = useGetCarByIdQuery(carId, {skip: !carId});
    useEffect(() => {
        if (brandsData?.data) {
            setBrands(brandsData.data.map(brand => ({label: brand.name, _id: brand._id})));
        }
        if (modelsData?.data) {
            setModels(modelsData.data.map(model => ({label: model.name, _id: model._id, brand: model.brand})));
        }
        if (colorsData?.data) {
            setColors(colorsData.data.map(color => ({label: color.name, _id: color._id})));
        }
    }, [brandsData, modelsData, colorsData]);
    const [selectedBrand, setSelectedBrand] = useState(false);
    const [selectedModel, setSelectedModel] = useState(false);
    const [selectedColor, setSelectedColor] = useState(false);
    useEffect(() => {
        if (carData && brands) {
            setSelectedBrand(brands.find(brand => brand._id === carData.brand));
            setBrandId(carData.brand)
        }
    }, [carData, brands]);
    useEffect(() => {
        if (carData && models) {
            setSelectedModel(models.find(model => model._id === carData.model));
            setModelId(carData.model)
        }
    }, [carData, models]);
    useEffect(() => {
        if (carData && colors) {
            setSelectedColor(colors.find(color => color._id === carData.color));
            setColorId(carData.color)
        }
    }, [carData, colors]);
    useEffect(() => {
        if (models && selectedBrand && selectedModel) {
            const filteredItems = models.filter(models => models.brand === selectedBrand._id);
            setFilteredModels(filteredItems);
            setSelectedModel(selectedModel.brand === selectedBrand._id ? selectedModel : false);
            setModelId(selectedModel.brand === selectedBrand._id ? selectedModel._id : '');
        } else
            console.log("model not found")
    }, [selectedBrand, models, modelId]);
    const [formData, setFormData] = useState({
        bodyNo: '',
        //  engineNo: '',
        mileage: '',
        //  year: '',
        buyPrice: '',
        taxIncluded: '',
        fuelType: '',
        description: '',
        plateNo: '',
         registeredDocumentNo: '',
        HUAU: '',
        accidentalDamage: '',
        accidentalDamageDescription: '',
        firstRegistration: '',
        // Add other form fields here
        outOfList,
        tires: '',
        tiresType: '',
        rims: '',
        rimsSize: ''
    });

    
    useEffect(() => {
        if (carData) {
            setFormData({
                bodyNo: carData.bodyNo || '',
                //  engineNo: carData.engineNo || '',
                mileage: carData.mileage || '',
                //  year: carData.year || '',
                buyPrice: carData.buyPrice || '',
                taxIncluded: carData.taxIncluded || '',
                fuelType: carData.fuelType || '',
                description: carData.description || '',
                plateNo: carData.plateNo || '',
                  registeredDocumentNo: carData.registeredDocumentNo || '',
                HUAU: carData.HUAU || '',
                accidentalDamage: carData.accidentalDamage || '',
                accidentalDamageDescription: carData.accidentalDamageDescription || '',
                firstRegistration: carData.firstRegistration || '',
                // Add other form fields here
                outOfList: carData.outOfList || '',
                tires: carData.tires || '',
                tiresType: carData.tiresType || '',
                rims: carData.rims || '',
                rimsSize: carData.rimsSize || ''

            });

            setFirstRegistration(dayjs(carData.firstRegistration, "DD.MM.YYYY"));
            setHuauDate(dayjs(carData.HUAU , "MM.YYYY"));
            setOutOfList(carData.outOfList);
            setLastImages(carData.image);
            setLastFiles(carData.files);
            setIncludeTax(carData.taxIncluded);
        }
    }, [carData]);
    // Calculate tax amount using the formula
    const taxRate = 0.19;
    const buyPrice = parseFloat(formData.buyPrice || 0);
    const netAmount = includeTax ? (buyPrice / (1 + taxRate)).toFixed(2) : '';
    const taxAmount = includeTax ? (buyPrice - netAmount).toFixed(2) : '';
    // Event handlers and logic from AddCar.js
    const handleTaxCheckboxChange = () => {
        setIncludeTax(!includeTax);
    };
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => ({...prevState, [name]: value}));
        // If the changed field is 'buyPrice' and 'includeTax' is checked, update 'taxIncluded'
        if (name === 'buyPrice' && includeTax) {
            setFormData(prevState => ({...prevState, taxIncluded: true}));
        }
        // If 'includeTax' is unchecked, ensure 'taxIncluded' is set to false
        if (name === 'includeTax') {
            setFormData(prevState => ({...prevState, taxIncluded: event.target.checked}));
        }
    };
    const handleDateChange = (name) => (value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        if (name === 'haauDate')
        {
            // Format the date to MM / YYYY format
            const formattedDate =moment(value.$d).format('MM.YYYY')  ;
            setFormattedHuauDate(formattedDate);
            setHuauDate(value);
        }

        else if (name === 'firstRegistration')
        {
            const formattedDate = moment(value.$d).format('DD.MM.YYYY');
            setFormattedFirstRegistration(formattedDate);
            setFirstRegistration(value);
        }

    };
    const validate = (t,data) => {
        return validateCarForm(t,data, brandId, modelId, colorId, firstRegistration, huauDate);
    };
    const userData = useSelector((state) => state.auth.userData);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const errors = validate(t,data);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            console.log(errors);
            return;
        }
        try {
            const response = await updateCar({
                id: carData._id, updatedCar: {
                    _id: carId,
                    //brand: data.get('brand'),
                    brand: brandId,
                    // color: data.get('color'),
                    color: colorId,
                    // model: data.get('model'),
                    model: modelId,
                    user: userData._id,
                    inWareHouse: data.get('inWareHouse') === 'true',
                    bodyNo: data.get('bodyNo'),
                    //    engineNo: data.get('engineNo'),
                    mileage: Number(data.get('mileage')),
                    //    year: Number(data.get('year')),
                    buyPrice: Number(data.get('buyPrice')),
                    taxIncluded: includeTax,
                    description: data.get('description'),
                    plateNo: data.get('plateNo'),
                    fuelType: data.get('fuelType'),
                       registeredDocumentNo: data.get('registeredDocumentNo'),
                    HUAU: formattedHuauDate,
                    accidentalDamage: data.get('accidentalDamage'),
                    firstRegistration:  formattedFirstRegistration,
                    outOfList: outOfList,
                    tires: data.get('tires'),
                    tiresType: data.get('tiresType'),
                    rims: data.get('rims'),
                    rimsSize: data.get('rimsSize')

                }
            });
            // Conditionally adding accidentalDamageDescription
            if (data.get('accidentalDamage') === 'yes') {
                requestBody.accidentalDamageDescription = data.get('accidentalDamageDescription');
            }
            await handleUpload();
            await handleUploadPdf();
            await router.push('/cars');
            console.log('Car updated:', response.data);
        } catch (error) {
            console.error('Failed to update car:', error);
        }
    };
    if (brandsLoading || modelsLoading || colorsLoading || carsLoading || isLoading || isUploading || isUploadingPdf) return <p><CircularProgress/></p>;
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
                        {/* Brand */ }
                        <Grid item xs={ 12 } md={ 4 } minHeight="80px">
                            <FormControl fullWidth error={ Boolean(errors.brand) }>
                                { selectedBrand && (
                                    <Autocomplete
                                        id="brand-autocomplete"
                                        options={ brands }
                                        value={ selectedBrand }
                                        getOptionLabel={ (option) => option ? option.label : '' }
                                        onChange={ (event, newValue) => {
                                            setSelectedBrand(newValue ?? null);
                                        } }
                                        renderInput={ (params) => (
                                            <TextField
                                                { ...params }
                                                label={ t('cars.brand') }
                                                error={ Boolean(errors.brand) }
                                                helperText={ errors.brand }
                                                required
                                                InputProps={ {
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon/> { t('cars.brand') } :
                                                        </InputAdornment>
                                                    ),
                                                } }
                                            />
                                        ) }
                                    />
                                ) }
                            </FormControl>
                        </Grid>
                        {/* Model */ }
                        <Grid item xs={ 12 } md={ 4 } minHeight="80px">
                            <FormControl fullWidth error={ Boolean(errors.model) }>
                                { filteredModels ? (<Autocomplete
                                        id="model-autocomplete"
                                        options={ filteredModels }
                                        value={ selectedModel }
                                        noOptionsText={ t('cars.there_is_no_model_for_this_brand') }
                                        isOptionEqualToValue={ (option, value) => option._id === value._id }
                                        getOptionLabel={ (option) => option ? option.label : '' }
                                        onChange={ (event, newValue) => {
                                            setModelId(newValue?._id || '');
                                        } }
                                        renderInput={ (params) => (
                                            <TextField
                                                { ...params }
                                                label={ t('cars.model') }
                                                error={ Boolean(errors.model) }
                                                helperText={ errors.model }
                                                required
                                                InputProps={ {
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon/> { t('cars.model') } :
                                                        </InputAdornment>
                                                    ),
                                                } }
                                            />
                                        ) }
                                    />
                                ) : (<p><CircularProgress/></p>) }
                            </FormControl>
                        </Grid>
                        {/* Color */ }
                        <Grid item xs={ 12 } md={ 4 } minHeight="80px">
                            <FormControl fullWidth error={ Boolean(errors.color) }>
                                 <Autocomplete
                                        id="color-autocomplete"
                                        options={ colors }
                                        value={ selectedColor }
                                        getOptionLabel={ (option) => option ? option.label : '' }
                                        onChange={ (event, newValue) => {
                                            setColorId(newValue?._id || '');
                                        } }
                                        renderInput={ (params) => (
                                            <TextField
                                                { ...params }
                                                label={ t('cars.color') }
                                                error={ Boolean(errors.color) }
                                                helperText={ errors.color }
                                                required
                                                InputProps={ {
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon/> { t('cars.color') } :
                                                        </InputAdornment>
                                                    ),
                                                } }
                                            />
                                        ) }
                                    />

                            </FormControl>
                            {/*<FormControl fullWidth error={Boolean(errors.color)}>*/ }
                            {/*    <InputLabel id="color-label" required>Color</InputLabel>*/ }
                            {/*    <Select*/ }
                            {/*        labelId="color-label"*/ }
                            {/*        id="color"*/ }
                            {/*        name="color"*/ }
                            {/*        label="Color"*/ }
                            {/*        value={selectedColor ? selectedColor : ''}*/ }
                            {/*        required*/ }
                            {/*    >*/ }
                            {/*        {colors.map((color) => (*/ }
                            {/*            <MenuItem key={color._id} value={color._id}>*/ }
                            {/*                {color.name}*/ }
                            {/*            </MenuItem>*/ }
                            {/*        ))}*/ }
                            {/*    </Select>*/ }
                            {/*    {errors.color ? <FormHelperText>{errors.color}</FormHelperText> : " "}*/ }
                            {/*</FormControl>*/ }
                        </Grid>

                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.body_no') }
                            </Typography>
                            <TextField
                                name="bodyNo"
                                fullWidth
                                id="bodyNo"
                                value={ formData.bodyNo }
                                onChange={ handleInputChange }
                                required
                                error={ Boolean(errors.bodyNo) }
                                helperText={ errors.bodyNo ? errors.bodyNo : " " }
                            />
                        </Grid>
                        {/* Engine No */ }
                        {/*<Grid item xs={ 12 } md={ 4 }>*/ }
                        {/*    <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>*/ }
                        {/*        {t('cars.engine_no') }*/ }
                        {/*    </Typography>*/ }
                        {/*    <TextField*/ }
                        {/*        name="engineNo"*/ }
                        {/*        fullWidth*/ }
                        {/*        id="engineNo"*/ }
                        {/*        value={ formData?.engineNo }*/ }
                        {/*        onChange={ handleInputChange }*/ }
                        {/*        required*/ }
                        {/*        error={ Boolean(errors.engineNo) }*/ }
                        {/*        helperText={ errors.engineNo ? errors.engineNo : " " }*/ }
                        {/*    />*/ }
                        {/*</Grid>*/ }
                        {/* Mileage */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.mileage') }
                            </Typography>
                            <TextField
                                name="mileage"
                                fullWidth
                                id="mileage"
                                type="number"
                                value={ formData?.mileage }
                                onChange={ handleInputChange }
                                required
                                error={ Boolean(errors.mileage) }
                                helperText={ errors.mileage ? errors.mileage : t('cars.enter_a_mileage_between_0_and_1000000') }
                                inputProps={ {
                                    min: 0,
                                    max: 10000000,
                                    step: 1,         // Allows only whole numbers
                                    inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                    pattern: "[0-9]*" // Allows only digits
                                } }
                            />
                        </Grid>
                        {/* Year */ }
                        {/*<Grid item xs={ 12 } md={ 4 }>*/ }
                        {/*    <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>*/ }
                        {/*        {t('cars.year') }*/ }
                        {/*    </Typography>*/ }
                        {/*    <TextField*/ }
                        {/*        name="year"*/ }
                        {/*        fullWidth*/ }
                        {/*        id="year"*/ }
                        {/*        type="number"*/ }
                        {/*        value={ formData?.year }*/ }
                        {/*        onChange={ handleInputChange }*/ }
                        {/*        required*/ }
                        {/*        error={ Boolean(errors.year) }*/ }
                        {/*        helperText={ errors.year ? errors.year : "Enter a year between 1920 and " + new Date().getFullYear() }*/ }
                        {/*        inputProps={ {*/ }
                        {/*            min: 1920,*/ }
                        {/*            max: new Date().getFullYear(),*/ }
                        {/*        } }*/ }
                        {/*    />*/ }
                        {/*</Grid>*/ }
                        {/* buyPrice */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <b>{ t('cars.buy_price') }</b>
                            <span>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={ includeTax }
                                                onChange={ handleTaxCheckboxChange }
                                                name="includeTax"
                                                color="primary"
                                            />
                                        }
                                        label={ t('cars.tax') }
                                        style={ {marginLeft: "3px"} }
                                    />
                                </span>
                            { includeTax && (
                                <span>
                                        { t('cars.tax_amount') }: €{ taxAmount } (19%)
                                    </span>
                            ) }
                            <TextField
                                name="buyPrice"
                                fullWidth
                                id="buyPrice"
                                type="number"
                                inputProps={ {
                                    min: 0,
                                    max: 1000000,
                                    step: 500,         // Allows only whole numbers
                                    inputMode: 'numeric', // Ensures a numeric keyboard on mobile devices
                                    pattern: "[0-9]*" // Allows only digits
                                } }
                                value={ formData?.buyPrice }
                                onChange={ handleInputChange }
                                required
                                error={ Boolean(errors.buyPrice) }
                                helperText={ errors.buyPrice ? errors.buyPrice : " " }
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
                        {/* Fuel Type */ }
                        {/* Description */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.description') }
                            </Typography>
                            <TextField
                                name="description"
                                fullWidth
                                id="description"
                                error={ Boolean(errors.description) }
                                value={ formData?.description }
                                onChange={ handleInputChange }
                                helperText={ errors.description ? errors.description : " " }
                            />
                        </Grid>
                        {/* Plate Number */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.plate_no') }
                            </Typography>
                            <TextField
                                name="plateNo"
                                fullWidth
                                id="plateNo"
                                value={ formData?.plateNo }
                                onChange={ handleInputChange }
                                helperText={ " " }
                            />
                        </Grid>
                        {/* Registered Document No for Update */ }
                        <Grid item xs={12} md={4}>
                            <Typography as="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                { t('cars.registered_document_no') }
                            </Typography>
                            <TextField
                                name="registeredDocumentNo"
                                fullWidth
                                id="registeredDocumentNo"
                                value={formData?.registeredDocumentNo}  // Use formData to set the value
                                onChange={handleInputChange}            // Function to handle changes
                                required
                                error={Boolean(errors.registeredDocumentNo)} // Show error if there's any
                                helperText={errors.registeredDocumentNo ? errors.registeredDocumentNo : " "}
                            />
                        </Grid>
                        {/* HUAU for Update */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.hu_au') }
                            </Typography>
                            <LocalizationProvider dateAdapter={ AdapterDayjs }>
                                <DatePicker
                                    views={ ['year', 'month'] }
                                    name="haauDate"
                                    inputFormat="MM.YYYY"
                                    id="haauDate"
                                    value={  huauDate }
                                    onChange={ handleDateChange('haauDate') }
                                    error={ Boolean(errors.haauDate) }
                                    renderInput={ (params) => (
                                        <TextField
                                            { ...params }
                                            fullWidth
                                            helperText={ errors.haauDate ? errors.haauDate : " " }
                                        />
                                    ) }
                                />
                            </LocalizationProvider>
                            {/*<TextField*/ }
                            {/*    name="HUAU"*/ }
                            {/*    fullWidth*/ }
                            {/*    id="HUAU"*/ }
                            {/*    value={formData?.HUAU}            // Use formData to set the value*/ }
                            {/*    onChange={handleInputChange}      // Function to handle changes*/ }
                            {/*    required*/ }
                            {/*    error={Boolean(errors.HUAU)}      // Show error if there's any*/ }
                            {/*    helperText={errors.HUAU ? errors.HUAU : " "}*/ }
                            {/*/>*/ }
                        </Grid>
                        {/* First Registration Date for Update */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.date') }
                            </Typography>
                            <LocalizationProvider dateAdapter={ AdapterDayjs }>
                                <DatePicker
                                    name="firstRegistration"
                                    id="firstRegistration"
                                    inputFormat="DD.MM.YYYY"
                                    value={ firstRegistration }
                                    onChange={ handleDateChange('firstRegistration') }
                                    error={ Boolean(errors.firstRegistration) }
                                    renderInput={ (params) => (
                                        <TextField
                                            { ...params }
                                            fullWidth
                                            helperText={ errors.firstRegistration ? errors.firstRegistration : " " }
                                        />
                                    ) }
                                />
                            </LocalizationProvider>
                        </Grid>
                        {/* Accidental Damage for Update */ }
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.accidental_damage') }
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="accidentalDamage-label"
                                    id="accidentalDamage"
                                    name="accidentalDamage"
                                    value={ formData?.accidentalDamage }   // Use formData to set the value
                                    onChange={ handleInputChange }        // Function to handle changes
                                    error={ Boolean(errors.accidentalDamage) }  // Show error if there's any
                                >
                                    <MenuItem value="yes">beschädigtes Fahrzeug</MenuItem>
                                    <MenuItem value="no">unfallfrei laut Vorbesitzer</MenuItem>
                                    <MenuItem value="repaired">reparierte Vorschäden möglich</MenuItem>
                                    <MenuItem value="unknown">{ t('cars.unknown') }</MenuItem>
                                </Select>
                                <FormHelperText error={ Boolean(errors.accidentalDamage) }>
                                    { errors.accidentalDamage ? errors.accidentalDamage : " " }
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        {/* Accidental Damage Description for Update */ }
                        { formData.accidentalDamage === 'yes' && (
                            <Grid item xs={ 12 } md={ 4 }>
                                <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                    { t('cars.accidental_damage_description') }
                                </Typography>
                                <TextField
                                    name="accidentalDamageDescription"
                                    fullWidth
                                    id="accidentalDamageDescription"
                                    value={ formData?.accidentalDamageDescription }   // Use formData to set the value
                                    onChange={ handleInputChange }                    // Function to handle changes
                                    required
                                    error={ Boolean(errors.accidentalDamageDescription) }  // Show error if there's any
                                    helperText={ errors.accidentalDamageDescription ? errors.accidentalDamageDescription : " " }
                                />
                            </Grid>
                        ) }
                        <Grid item xs={ 12 }></Grid>
                        <Grid item xs={ 12 } md={ 4 }>
                            <Typography as="h5" sx={ {fontWeight: "500", fontSize: "14px", mb: "12px"} }>
                                { t('cars.fuel_type') }
                            </Typography>
                            <FormControl fullWidth error={ Boolean(errors.fuelType) }>
                                <Select
                                    labelId="fuelType-label"
                                    id="fuelType"
                                    name="fuelType"
                                    value={ formData?.fuelType }   // Use formData to set the value
                                    error={ Boolean(errors.fuelType) }
                                    onChange={ handleInputChange }                    // Function to handle changes
                                >
                                    <MenuItem value="petrol">{ t('cars.petrol') }</MenuItem>
                                    <MenuItem value="diesel">{ t('cars.diesel') }</MenuItem>
                                    <MenuItem value="electric">{ t('cars.electric') }</MenuItem>
                                    <MenuItem
                                        value="hybrid_petrol_electric">{ t('cars.hybrid_petrol_electric') }</MenuItem>
                                    <MenuItem
                                        value="hybrid_diesel_electric">{ t('cars.hybrid_diesel_electric') }</MenuItem>
                                    <MenuItem value="natural_gas_cng">{ t('cars.natural_gas_cng') }</MenuItem>
                                    <MenuItem value="autogas_lpg">{ t('cars.autogas_lpg') }</MenuItem>
                                    <MenuItem value="hydrogen">{ t('cars.hydrogen') }</MenuItem>
                                    <MenuItem value="ethanol_e85">{ t('cars.ethanol_e85') }</MenuItem>
                                </Select>
                                { errors.fuelType && (
                                    <FormHelperText>{ errors.fuelType }</FormHelperText>  // Assuming errors.fuelType has a property 'message'
                                ) }
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
                        <Grid item xs={ 12 }></Grid>
                        <Grid item xs={ 12 }
                              sx={ {
                                  boxShadow: "none",
                                  borderRadius: "10px",
                                  p: "25px",
                                  mb: "15px",
                              } }
                              xs={ 12 }
                        >
                            <Typography
                                as="h3"
                                sx={ {
                                    fontSize: 18,
                                    fontWeight: 500,
                                    mb: "15px",
                                } }
                            >
                                { t('cars.upload_multiple_Files') }
                                <hr/>
                            </Typography>
                            <div { ...getRootPropsPdf() } className={ styles.dropzone }>
                                <input { ...getInputPropsPdf() } accept=".doc,.docx,.pdf,.jpg,.jpeg"/>
                                <Box
                                    sx={ {
                                        display: "flex",
                                        flexDirection: ["column", "column", "row"],
                                        alignItems: "center",
                                    } }
                                >
                                    <Box
                                        sx={ {
                                            display: "flex",
                                            flexDirection: "column",
                                            textAlign: ["center", "center", "inherit"],
                                        } }
                                    >
                                        <Typography variant="h5" fontWeight="500" mb={ 1 }>
                                            { t('cars.upload_multiple_Files') }
                                        </Typography>
                                        <Typography color="textSecondary">
                                            { t('cars.drop_files_here_or_click_to_upload') }{ " " }
                                            <Link href="/" onClick={ handleLinkClick }>
                                                { t('act.browse') }
                                            </Link>{ " " }
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            { filesPdf.length ? (
                                <Fragment>
                                    <List>{ fileListPdf }</List>
                                </Fragment>
                            ) : null }
                        </Grid>
                        {/* Images for Update */ }
                        <Grid item xs={ 12 } md={ 12 }>
                            <Typography
                                as="h3"
                                sx={ {
                                    fontSize: 18,
                                    fontWeight: 500,
                                    mb: "15px",
                                } }
                            >
                                Existing Files
                                <hr/>
                            </Typography>
                        </Grid>
                        <Grid container sx={ {p: 3} } alignItems="center" spacing={ 2 }>
                            <List
                                sx={ {
                                    width: '100%',
                                    maxWidth: 360,
                                } }
                            >
                                { lastFiles ? (
                                    lastFiles?.map((fileUrl, index) => {
                                        const fileName = fileUrl.split('/').pop(); // Extracts the image name from the URL
                                        return (
                                            <ListItem xs={ 12 } sm={ 6 }>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <CloudDownloadIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={ (<Link
                                                    href={ fileUrl.replace('./', process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')) }>{ fileName }</Link>) }/>
                                            </ListItem>
                                        )
                                    })
                                ) : (
                                    <p>No files available.</p>
                                ) }
                            </List>
                        </Grid>
                        <Grid item xs={ 12 }
                              sx={ {
                                  boxShadow: "none",
                                  borderRadius: "10px",
                                  p: "25px",
                                  mb: "15px",
                              } }
                        >
                            <Typography
                                as="h3"
                                sx={ {
                                    fontSize: 18,
                                    fontWeight: 500,
                                    mb: "15px",
                                } }
                            >
                                Upload Multiple Files
                                <hr/>
                            </Typography>
                            <div { ...getRootProps() } className={ styles.dropzone }>
                                <input { ...getInputProps() } />
                                <Box
                                    sx={ {
                                        display: "flex",
                                        flexDirection: ["column", "column", "row"],
                                        alignItems: "center",
                                    } }
                                >
                                    <Box
                                        sx={ {
                                            display: "flex",
                                            flexDirection: "column",
                                            textAlign: ["center", "center", "inherit"],
                                        } }
                                    >
                                        <Typography variant="h5" fontWeight="500" mb={ 1 }>
                                            { t('cars.upload_multiple_images') }
                                        </Typography>
                                        <Typography color="textSecondary">
                                            { t('cars.drop_files_here_or_click_to_upload') }{ " " }
                                            <Link href="/" onClick={ handleLinkClick }>
                                                { t('act.browse') }
                                            </Link>{ " " }
                                        </Typography>
                                    </Box>
                                </Box>
                            </div>
                            { files.length ? (
                                <Fragment>
                                    <List>{ fileList }</List>
                                </Fragment>
                            ) : null }
                        </Grid>
                        {/* Images for Update */ }
                        <Grid item xs={ 12 } md={ 12 }>
                            <Typography
                                as="h3"
                                sx={ {
                                    fontSize: 18,
                                    fontWeight: 500,
                                    mb: "15px",
                                } }
                            >
                                Existing Images
                                <hr/>
                            </Typography>
                        </Grid>
                        <Grid container sx={ {p: 3} } alignItems="center" spacing={ 2 }>
                            { lastImages ? (
                                lastImages?.map((imageUrl, index) => {
                                    const imageName = imageUrl.split('/').pop(); // Extracts the image name from the URL
                                    return (
                                        <Grid item xs={ 12 } md={ 2 } minHeight="80px" key={ index }>
                                            <Image
                                                src={ imageUrl.replace('./', process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')) }
                                                alt={ `Car ${ index + 1 }` }
                                                width={ 128 }
                                                height={ 128 }// You might want to adjust the width and height ratios according to your layout requirements
                                                layout="fixed"
                                                objectFit="cover"
                                            />
                                            <Button
                                                startIcon={ <DeleteIcon sx={ {color: '#fff !important'} }/> }
                                                variant="contained"
                                                color="danger"
                                                sx={ {
                                                    textTransform: 'capitalize',
                                                    borderRadius: '10px',
                                                    mt: '10px',
                                                    color: '#fff',
                                                    p: '10px 30px',
                                                    fontSize: '14px',
                                                    color: '#fff !important',
                                                } }
                                                type={ 'button' }
                                                className="mr-10px"
                                                onClick={ () => handleDeleteImage(imageName) }
                                            >
                                                { t('act.delete') }
                                            </Button>
                                        </Grid>
                                    )
                                })
                            ) : (
                                <p>No images available.</p>
                            ) }
                        </Grid>
                        {/* Submit Button */ }
                        <Grid item xs={ 12 } md={ 12 } textAlign="left">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={ {
                                    mt: 2,
                                    mb: 5,
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "13px",
                                    padding: "12px 20px",
                                    color: "#fff !important",
                                } }
                            >
                                <EditIcon
                                    sx={ {position: "relative", top: "-2px"} }
                                    className='mr-5px'
                                />{ " " }
                                { t('act.update') }
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
}
export default UpdateCar;
