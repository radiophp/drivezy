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
import { useUpdateColorMutation, useGetColorByIdQuery } from '@/redux/slices/colorsApiSlice'; // Updated import for color
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const UpdateColors = () => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const { data: color, error, isLoading } = useGetColorByIdQuery(id, { skip: !id }); // Updated for color
    const [colorName, setColorName] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [updateColor, { isLoading: isUpdating }] = useUpdateColorMutation(id, { skip: !id }); // Updated for color

    useEffect(() => {
        if (color) {
            setColorName(color.name); // Updated for color
        }
    }, [color]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await updateColor({ id: color._id, updatedColor: { name: colorName } }); // Updated for color

            console.log('Update result:', result);

            if (result.data && !result.error) {
                setSuccessDialogOpen(true);
            } else if (result.error) {
                setErrorDialogOpen(true);
            }
        } catch (error) {
            console.error('Failed to update color:', error); // Updated error message for color
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
                                {t('cars.color')}
                            </Typography>
                            <TextField
                                name="colorName"
                                value={colorName}
                                onChange={(e) => setColorName(e.target.value)}
                                fullWidth
                                id="colorName"

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
                                <AddCircleIcon sx={{ position: "relative", top: "-2px" }} className='mr-5px' />{" "}
                                {t('act.update')}
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
                        Color updated successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setSuccessDialogOpen(false);
                        router.push('/colors'); // Updated for colors
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
                        Failed to update the color. Please try again. // Updated for color
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

export default UpdateColors;
