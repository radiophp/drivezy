import React, {useCallback, useEffect, useState} from 'react';
import { Grid, Typography, Card, CardMedia, Dialog, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImagesGridCar = ({ car }) => {
    console.log("car.image: ", car.image);
    const [open, setOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const handleOpen = (index) => {
        setCurrentImgIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNext = () => {
        setCurrentImgIndex((prevIndex) =>
            prevIndex === car.image.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevious = () => {
        setCurrentImgIndex((prevIndex) =>
            prevIndex === 0 ? car.image.length - 1 : prevIndex - 1
        );
    };

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            }
        },
        [handleNext, handlePrevious]
    );

    useEffect(() => {
        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, handleKeyDown]);

    return (
        <>
            {car.image && car.image.length > 0 && (
                <Grid item xs={12}>
                    <Typography variant="h6">Images:</Typography>
                    <Grid container spacing={2}>
                        {car.image.map((img, index) => (
                            <Grid item xs={6} sm={4} md={2} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')+img } // Assuming img is a path to the image
                                        alt={`Car Image ${index + 1}`}
                                        onClick={() => handleOpen(index)}
                                        sx={{
                                            height: 200,
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}

            {/* Image Gallery Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="lg">
                <IconButton onClick={handlePrevious} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <img
                    src={process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')+car.image[currentImgIndex]}
                    alt={`Car Image ${currentImgIndex + 1}`}
                    style={{ maxHeight: '80vh', maxWidth: '100%', display: 'block', margin: 'auto' }}
                />
                <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Dialog>
        </>
    );
};

export default ImagesGridCar;
