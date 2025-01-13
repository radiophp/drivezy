import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    Button
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useUpdateBrandMutation, useGetBrandByIdQuery } from '@/redux/slices/brandsApiSlice';
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const UpdateBrand = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const { data: brand, error, isLoading } = useGetBrandByIdQuery(id, { skip: !id });
    const [brandName, setBrandName] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation( id,{ skip: !id });

    useEffect(() => {
        if (brand) {
            setBrandName(brand.name);
        }
    }, [brand]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await updateBrand({ id: brand._id, updatedBrand: { name: brandName } });

            console.log('Update result:', result);

            if (result.data && !result.error) {

                setSuccessDialogOpen(true);
            } else if (result.error) {

                setErrorDialogOpen(true);
            }

        } catch (error) {
            console.error('Failed to update brand:', error);
        }
    };


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred: {error.message}</p>;

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
                <Box component="form" noValidate onSubmit={handleSubmit}>
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
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                fullWidth
                                id="brandName"

                                autoFocus
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} textAlign="left">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isUpdating} // Disable button while updating
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
                                <AddCircleIcon sx={{ position: "relative", top: "-2px" }} className='mr-5px' />{" "}
                                Update Brand
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            {/* Success Dialog */}
            <Dialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
            >
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Brand updated successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setSuccessDialogOpen(false);
                        router.push('/brands');
                    }} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Failed to update the brand. Please try again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UpdateBrand;
