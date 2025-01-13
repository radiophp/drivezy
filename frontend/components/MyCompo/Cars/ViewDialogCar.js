// Import necessary hooks and components from React, Next.js, Material UI, and your API slices.
import React from 'react';
import { useRouter } from 'next/router';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetCarByIdQuery } from '@/redux/slices/carsApiSlice';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import useTranslation from "next-translate/useTranslation";
import { useGetModelByIdQuery } from "@/redux/slices/modelsApiSlice";
import { useGetBrandByIdQuery } from "@/redux/slices/brandsApiSlice";
import { useGetColorByIdQuery } from "@/redux/slices/colorsApiSlice";
import HumanReadableDate from "@/components/MyCompo/_Tools/HumanReadableDate";
import ImagesGridCar from "@/components/MyCompo/Cars/ImagesGridCar";
const ViewDialogCar = ({ id }) => {
    console.log("id: ", id);
    const router = useRouter();
    const { t, lang } = useTranslation('common');


    // Using the generated hook to get the car data
    const { data: car, error, isLoading } = useGetCarByIdQuery(id);
    const { data: modelData, error: errorModel, isLoading: isLoadingModel } = useGetModelByIdQuery(car ? car.model : skipToken);
    const { data: brandData, error: errorBrand, isLoading: isLoadingBrand } = useGetBrandByIdQuery(car ? car.brand : skipToken);
    const { data: colorData, error: errorColor, isLoading: isLoadingColor } = useGetColorByIdQuery(car ? car.color : skipToken);

    // If loading, return a loading state...
    if (isLoading) return <div>Loading...</div>;

    // If there was an error fetching the car, return an error message...
    if (error) return <div>Error fetching car details</div>;

    // If car data is loaded, render the car details and images
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" fontWeight="bold">
                            {brandData && brandData.name}   {modelData && modelData.name}  {car && `- ${car.description}`}
                        </Typography>

                        {/* Nested Grid for Body No and Engine No */}
                        <Grid container spacing={2}>
                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.body_no')}: {car.bodyNo}
                                </Typography>
                            </Grid>
                            {/*<Grid item sm={4} xs={12}>*/}
                            {/*    <Typography color="text.secondary" fontWeight="bold">*/}
                            {/*        Engine No: {car.engineNo}*/}
                            {/*    </Typography>*/}
                            {/*</Grid>*/}

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.mileage')}: {car.mileage}
                                </Typography>
                            </Grid>
                     

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.color')}: {colorData?.name && colorData?.name}
                                </Typography>
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.tires')}: {car.tires && car.tires }
                                </Typography>
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.tiresType')}: {car.tiresType && car.tiresType}
                                </Typography>
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.rims')}: {car.rims && car.rims}
                                </Typography>
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.rimsSize')}: {car.rimsSize && car.rimsSize}
                                </Typography>
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.plate_no')}: {car.plateNo}
                                </Typography>
                            </Grid>


                            {/* Second Row */}
                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.fuel_type')}: {car.fuelType}
                                </Typography>
                            </Grid>
                            {/*<Grid item sm={4} xs={12}>*/}
                            {/*    <Typography color="text.secondary" fontWeight="bold">*/}
                            {/*        Registered Document No: {car.registeredDocumentNo}*/}
                            {/*    </Typography>*/}
                            {/*</Grid>*/}
                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.hu_au')}: {car.HUAU}
                                </Typography>
                            </Grid>

                            {/* Third Row */}
                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.date')}: <HumanReadableDate dateString={car.firstRegistration} />
                                </Typography>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.accidental_damage')}: {car.accidentalDamage}
                                </Typography>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Typography color="text.secondary" fontWeight="bold">
                                    {t('cars.accidental_damage_description')}: {car.accidentalDamageDescription || 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
            

                        {/* Add more details as necessary */}
                    </CardContent>
                </Card>
            </Grid>

            {/* If car images are available, render them in a grid */}
            {car?.image && (<ImagesGridCar car={car} />)}



        </Grid>
    );
};

export default ViewDialogCar;
