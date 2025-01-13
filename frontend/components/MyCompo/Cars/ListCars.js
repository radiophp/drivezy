import * as React from "react";
import {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {useDeleteCarMutation, useGetAllCarsWithInvoicesQuery,useGetAllCarsWithCommissionInvoicesQuery } from '@/redux/slices/carsApiSlice'; // Make sure to adjust the import paths
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteCarConfirmationDialog from "@/components/MyCompo/Cars/DeleteCarConfirmationDialog"; // Make sure to adjust the import paths
import {useRouter} from 'next/router';
import SearchBar from "@/components/MyCompo/Cars/SearchBar"; // Make sure to adjust the import paths
import Pagination from "@/components/MyCompo/Cars/Pagination"; // Make sure to adjust the import paths
import {useGetAllBrandsQuery} from '@/redux/slices/brandsApiSlice';
import {useGetAllColorsQuery} from '@/redux/slices/colorsApiSlice'; // Import to get all colors
import {useGetAllModelsQuery} from '@/redux/slices/modelsApiSlice';
import useTranslation from "next-translate/useTranslation"; // Import to get all models
import ViewDialogCar from "@/components/MyCompo/Cars/ViewDialogCar";
import PreviewIcon from '@mui/icons-material/Preview';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import HumanReadableDate from "@/components/MyCompo/_Tools/HumanReadableDate";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import Box from '@mui/material/Box';
import {error} from "next/dist/build/output/log";
import { format } from "date-fns";
const fetchCommissionInvoices = () => useGetAllCarsWithCommissionInvoicesQuery();
const fetchInvoices = () => useGetAllCarsWithInvoicesQuery();
const ActionButtons = ({onEdit, onDelete, onView, inWareHouse}) => (
    <>
        <Fab
            color="info"
            aria-label="view"
            size="small"
            variant="extended"
            onClick={ onView }
        >
            <PreviewIcon sx={ {color: '#fff !important'} }/>
        </Fab>{ ' ' }
        { inWareHouse && (
            <Fab
                color="primary"
                aria-label="edit"
                size="small"
                variant="extended"
                onClick={ onEdit }
            >
                <EditIcon sx={ {color: '#fff !important'} }/>
            </Fab>
        ) }

        { ' ' }
        {/*<Fab*/ }
        {/*    color="danger"*/ }
        {/*    aria-label="delete"*/ }
        {/*    size="small"*/ }
        {/*    variant="extended"*/ }
        {/*    onClick={onDelete}*/ }
        {/*>*/ }

        {/*    <ClearIcon sx={{ color: '#fff !important' }} />*/ }
        {/*</Fab>*/ }
    </>
);
const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
const CustomTableCell = ({title, align, children}) => (
    <TableCell
        align={ align }
        sx={ {
            borderBottom: "1px solid #F7FAFF",
            padding: "8px 10px",
            fontSize: "13px",
            textAlign: "left",
        } }
        title={ title }
    >
        { children }
    </TableCell>
);

function createData(_id, brand, color, model, user, inWareHouse, bodyNo, engineNo, mileage, year, description, plateNo, fuelType, updatedAt, createdAt, invoices, activeInvoiceType, activeInvoiceFile, soldDate,files,brandName,colorName,modelName,buyPrice
) {
    return {
        _id,
        brand,
        color,
        model,
        user,
        inWareHouse,
        bodyNo,
        engineNo,
        mileage,
        year,
        description,
        plateNo,
        fuelType,
        updatedAt,
        createdAt,
        invoices,
        activeInvoiceType,
        activeInvoiceFile,
        soldDate,
        files,
        brandName,
        colorName,
        modelName,
        buyPrice
    };
}

const ListCars = () => {
    const {t, lang} = useTranslation('common');
    const router = useRouter();
    //const { data: carsData, error, isLoading } = useGetAllCarsQuery(); // Adjust this according to the actual hook name
    const [showCommissionInvoices, setShowCommissionInvoices] = useState(false);

    // Adjust the hook to fetch data based on the toggle state
    // const { data: carsData, error, isLoading } = showCommissionInvoices
    //     ? useGetAllCarsWithCommissionInvoicesQuery()
    //     : useGetAllCarsWithInvoicesQuery();
    const { data: commissionData, isLoading: isLoadingCommission, error: errorCommission } =  fetchCommissionInvoices() ;
    const { data: carsData, isLoading: isLoadingInvoice, error: errorInvoice } =  fetchInvoices() ;

    const {data: brandsData} = useGetAllBrandsQuery(); // Fetch all brands
    const [deleteCar] = useDeleteCarMutation(); // Adjust this according to the actual hook name
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cars, setCars] = useState([]);
    const [brandMap, setBrandMap] = useState({});
    const {data: colorsData} = useGetAllColorsQuery(); // Fetch all colors
    const {data: modelsData} = useGetAllModelsQuery(); // Fetch all models
    const [colorMap, setColorMap] = useState({});
    const [modelMap, setModelMap] = useState({});
    const [carForView, setCarForView] = useState(null);
    const [openViewDialogCar, setOpenViewDialogCar] = useState(false);
    const [filter, setFilter] = useState('all');
    useEffect(() => {

        
        const dataLo = showCommissionInvoices ? commissionData : carsData;
         
         
        if (dataLo?.data) {
            let filteredCars = dataLo.data;
            if (filter !== 'all') {
                filteredCars = filteredCars.filter(car => car.inWareHouse === (filter === 'inWarehouse'));
            }
            const carData = filteredCars.map(car => createData(
                car._id,
                car.brand,
                car.color,
                car.model,
                car.user,
                car.inWareHouse,
                car.bodyNo,
                car.engineNo,
                car.mileage,
                car.year,
                car.description,
                car.plateNo,
                car.fuelType,
                car.updatedAt,
                car.createdAt,
                car.invoices,
                car.activeInvoiceType,
                car.activeInvoiceFile,
                car.soldDate,
                car.files,
                car.brandName,
                car.colorName,
                car.modelName,
                car.buyPrice
            
            ));

            
            setCars(carData);
        }
    }, [showCommissionInvoices ,carsData , commissionData,filter]);


    useEffect(() => {
        // Create a mapping of brand ID to brand name
        if (brandsData?.data) {
            const map = {};
            brandsData.data.forEach(brand => {
                map[brand._id] = brand.name;
            });
            setBrandMap(map);
        }
    }, [brandsData]);
    useEffect(() => {
        // Create a mapping of color ID to color name
        if (colorsData?.data) {
            const map = {};
            colorsData.data.forEach(color => {
                map[color._id] = color.name;
            });
            setColorMap(map);
        }
    }, [colorsData]);

    useEffect(() => {
        // Create a mapping of model ID to model name
        if (modelsData?.data) {
            const map = {};
            modelsData.data.forEach(model => {
                map[model._id] = model.name;
            });
            setModelMap(map);
        }
    }, [modelsData]);
    const toggleCommissionInvoices = () => {
        
        setShowCommissionInvoices(!showCommissionInvoices);
    };
    
    const openDialog = (car) => {
        setSelectedCar(car);
        setDialogOpen(true);
    };
    const openDialogView = (car) => {

        setCarForView(car);
        setOpenViewDialogCar(true);

    };
    const closeDialog = () => {
        setDialogOpen(false);
    };
    const handleCloseViewDialogCar = () => {
        setOpenViewDialogCar(false); // Function to close the dialog

    };
    const handleConfirmDelete = async (carID) => {
        try {
            await deleteCar(carID);
            const updatedCars = cars.filter(car => car._id !== carID);
            setCars(updatedCars);
        } catch (error) {
            console.error('Failed to delete the car:', error);
        }
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCars = cars.filter(car =>
        car.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.colorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.bodyNo?.toLowerCase().includes(searchTerm.toLowerCase()) 

    );
    const toSnakeCase = (str) => {

        return (str) ? str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() : "in_stock";
    }
    const handleOnEdit = (carID) => {
        router.push(`/cars/update/${ carID }`);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cars.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoadingCommission || isLoadingInvoice) return <p>Loading...</p>;
    if (errorInvoice || errorCommission) return <p>Error occurred: { error.message }</p>;

    return (
        <>
            <Card sx={ {boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px"} }>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        {showCommissionInvoices ? t('cars.show_commission_cars') : t('cars.show_normal_cars')}
                    </Typography>
                    <Button
                        onClick={toggleCommissionInvoices}
                        variant="contained"
                        startIcon={<SwapHorizIcon />}
                        sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                    >
                        {showCommissionInvoices ? t('cars.show_normal_cars') : t('cars.show_commission_cars')}
                    </Button>
                </Box>

                <SearchBar handleSearchChange={ handleSearchChange } searchTerm={ searchTerm } t={ t } setFilter={setFilter}  filter={filter} callFrom='list'/>
                <TableContainer component={ Paper } sx={ {boxShadow: "none"} }>
                    <Table sx={ {minWidth: 950} } aria-label="custom pagination table">
                        <TableHead sx={ {background: "#F7FAFF"} }>
                            <TableRow>
                                <CustomTableCell>{ t('cars.brand') } / { t('cars.model') } / { t('cars.description') }</CustomTableCell>

                                <CustomTableCell>{ t('cars.color') }</CustomTableCell>
                                <CustomTableCell>{ t('cars.body_no') }</CustomTableCell>
                                <CustomTableCell>{ t('cars.buy_price') }</CustomTableCell>
                                <CustomTableCell>{ t('cars.status') }</CustomTableCell>

                                <CustomTableCell>{ t('act.actions') }</CustomTableCell>
                                <CustomTableCell>{ t('invoice.buy_contract_files') }</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { (rowsPerPage > 0
                                    ? filteredCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filteredCars
                            ).map((car) => (
                                <TableRow key={ car._id }
                                          sx={ {backgroundColor: car.inWareHouse ? '#FFF' : '#f1ecec'} }>
                                    <CustomTableCell>{ brandMap[car.brand] || car.brand }   { modelMap[car.model] || car.model }  { car?.description &&  `- ${car?.description}`}  </CustomTableCell>

                                    <CustomTableCell>{ colorMap[car.color] || car.color }</CustomTableCell>
                                    <CustomTableCell>{ car.bodyNo }</CustomTableCell>
                                    <CustomTableCell>{ formatPrice(car.buyPrice)  }</CustomTableCell>
                                    <CustomTableCell>
                                        { car.activeInvoiceType === false ? t('cars.in_stock') : (
                                            <>
                                                <b>
                                                    <a href={ process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '') + car?.activeInvoiceFile.replace(/\\/g, '/') }
                                                       download
                                                       target={ '_blank' }
                                                       style={ {
                                                           textDecoration: 'none',
                                                           display: 'flex',
                                                           alignItems: 'center',
                                                           cursor: 'pointer'
                                                       } }>
                                                        <CloudDownloadIcon/>
                                                        <span
                                                            style={ {marginLeft: '8px'} }>{ t('invoice.' + toSnakeCase(car.activeInvoiceType)) }</span>
                                                    </a>


                                                </b>
                                                <span sx={ {display: 'bloc'} }><HumanReadableDate
                                                    dateString={ car?.soldDate }/> </span>
                                            </>
                                        ) }

                                    </CustomTableCell>

                                    <CustomTableCell>
                                        <ActionButtons
                                            onEdit={ () => handleOnEdit(car._id) }
                                            onDelete={ () => openDialog(car) }
                                            onView={ () => openDialogView(car) }
                                            inWareHouse={ car.inWareHouse }
                                        />
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        { car.files.length > 0 && car.files.map((file,index) => (
                                            <>
                                                <a href={ process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '') + file.replace(/\\/g, '/') }
                                                   download
                                                   target={ '_blank' }
                                                   style={ {
                                                       textDecoration: 'none',
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       cursor: 'pointer'
                                                   } }>
                                                    <b> {t('invoice.file')+" "+(index+1)+"  "} </b>

                                                </a>
                                            </>
                                        ))}
                                    </CustomTableCell>
                                </TableRow>
                            )) }
                            { emptyRows > 0 && (
                                <TableRow style={ {height: 53 * emptyRows} }>
                                    <TableCell colSpan={ 6 }/>
                                </TableRow>
                            ) }
                        </TableBody>
                        <Pagination t={ t } cars={ cars } page={ page } rowsPerPage={ rowsPerPage }
                                    handleChangePage={ handleChangePage }
                                    handleChangeRowsPerPage={ handleChangeRowsPerPage }/>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog
                open={ openViewDialogCar }
                onClose={ handleCloseViewDialogCar }
                maxWidth="lg"
                fullWidth
            >
                <IconButton
                    aria-label="close"
                    onClick={ handleCloseViewDialogCar }
                    sx={ {
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    } }
                >
                    <CloseIcon/>
                </IconButton>
                {/* Here you will use your ViewDialogCar component, passing carForView as a prop */ }
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <ViewDialogCar id={ carForView?._id }/>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <DeleteCarConfirmationDialog
                open={ dialogOpen }
                car={ selectedCar }
                onClose={ closeDialog }
                onConfirm={ () => handleConfirmDelete(selectedCar._id) }
            />
        </>
    );
}

export default ListCars;
