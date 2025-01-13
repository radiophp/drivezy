import * as React from "react";
import {useEffect, useState} from "react";

import Table from "@mui/material/Table";

import TableContainer from "@mui/material/TableContainer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import GridItem from "@/components/MyCompo/Cars/GridItem";

import {useRouter} from "next/router";
import {useDeleteCarMutation, useGetAllCarsQuery,useGetAllAvailableCarsQuery} from "@/redux/slices/carsApiSlice";
import {useGetAllBrandsQuery} from "@/redux/slices/brandsApiSlice";
import {useGetAllColorsQuery} from "@/redux/slices/colorsApiSlice";
import {useGetAllModelsQuery} from "@/redux/slices/modelsApiSlice";
import useTranslation from "next-translate/useTranslation";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ViewDialogCar from "@/components/MyCompo/Cars/ViewDialogCar";
import Pagination from "@/components/MyCompo/Cars/Pagination";
import SearchBar from "@/components/MyCompo/Cars/SearchBar";
import Paper from "@mui/material/Paper";

function createData(_id, brand, color, model, user, inWareHouse, bodyNo, engineNo, mileage, year, description, registeredDocumentNo,
                    HUAU,
                    firstRegistration,
                    accidentalDamage,
                    accidentalDamageDescription,
                    image, plateNo, fuelType, updatedAt, createdAt) {
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
        registeredDocumentNo,
        HUAU,
        firstRegistration,
        accidentalDamage,
        accidentalDamageDescription,
        image,
        plateNo,
        fuelType,
        updatedAt,
        createdAt
    };
}

const GridCars = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const {data: carsData, error, isLoading} = useGetAllAvailableCarsQuery(); // Adjust this according to the actual hook name
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
    useEffect(() => {
        if (carsData?.data) {
            const carData = carsData.data.map(car => createData(
                car.car._id,
                car.car.brand,
                car.car.color,
                car.car.model,
                car.car.user,
                car.car.inWareHouse,
                car.car.bodyNo,
                car.car.engineNo,
                car.car.mileage,
                car.car.year,
                car.car.description,
                car.car.registeredDocumentNo,
                car.car.HUAU,
                car.car.firstRegistration,
                car.car.accidentalDamage,
                car.car.accidentalDamageDescription,
                car.car.image,
                car.car.plateNo,
                car.car.fuelType,
                car.car.updatedAt,
                car.car.createdAt
            ));
            setCars(carData);
        }
    }, [carsData]);
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
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred: { error.message }</p>;
    return (
        <>
            <Card sx={ {boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px"} }>
                <SearchBar t={t} handleSearchChange={ handleSearchChange } searchTerm={ searchTerm }  callFrom='grid' />
                <br/><br/>
                <Grid
                    container
                    rowSpacing={ 1 }
                    columnSpacing={ {xs: 1, sm: 1, md: 1, lg: 1, xl: 2} }
                >
                    { (rowsPerPage > 0
                            ? filteredCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredCars
                    ).map((car) => (
                        <GridItem handleOnEdit={ handleOnEdit } openDialog={ openDialog }
                                  openDialogView={ openDialogView } car={ car }
                                  brand={ brandMap[car.brand] || car.brand } model={ modelMap[car.model] || car.model }
                                  color={ colorMap[car.color] || car.color }
                                  t={t}
                        />
                    )) }
                    { emptyRows > 0 && (
                        <span> No cars found </span>
                    ) }

                </Grid>
                <TableContainer component={ Paper } sx={ {boxShadow: "none"} }>
                    <Table sx={ {minWidth: 950} } aria-label="custom pagination table">

                        <Pagination cars={ cars } page={ page } rowsPerPage={ rowsPerPage }
                                    handleChangePage={ handleChangePage }
                                    handleChangeRowsPerPage={ handleChangeRowsPerPage }
                                    t={t}
                        />
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
        </>
    );
}
export default GridCars;
