import React from 'react';
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAddBrandMutation } from '@/redux/slices/brandsApiSlice';
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation";


const AddBrand = () => {
    const { t, lang } = useTranslation('common');
    const [addBrand, { isLoading }] = useAddBrandMutation(); // Use mutation hook
    const router = useRouter();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const brandName = data.get("brandName"); // Retrieve the brand name from form data

        try {
            // Call mutation to add a new brand
            const response = await addBrand({ name: brandName });
            router.push('/brands');
            console.log('Brand added:', response.data);
        } catch (error) {
            console.error('Failed to add brand:', error);
        }
    };

    // Select Priority
    const [priority, setPriority] = React.useState('');
    const handleChange = (event) => {
        setPriority(event.target.value);
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
                        <Grid item xs={12} md={12} lg={6}>
                            <Typography
                                as="h5"
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    mb: "12px",
                                }}
                            >
                                {t('cars.brand')}
                            </Typography>
                            <TextField

                                name="brandName"
                                fullWidth
                                id="brandName"

                                autoFocus
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                        </Grid>





                        <Grid item xs={12}  md={12} lg={6} textAlign="left">
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
                                    sx={{
                                        position: "relative",
                                        top: "-2px",
                                    }}
                                    className='mr-5px'
                                />{" "}
                                {t('act.add')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    )
}

export default AddBrand;
