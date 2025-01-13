import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import * as React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";

import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PreviewIcon from '@mui/icons-material/Preview';
import Grid from "@mui/material/Grid";
import {format} from "date-fns";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));
const ActionButtons = ({ onEdit, onDelete ,onView }) => (
    <>
        <Fab
            color="info"
            aria-label="view"
            size="small"
            variant="extended"
            onClick={onView}
        >
            <PreviewIcon  sx={{ color: '#fff !important' }} />
        </Fab>{' '}
        <Fab
            color="primary"
            aria-label="edit"
            size="small"
            variant="extended"
            onClick={onEdit}
        >
            <EditIcon sx={{ color: '#fff !important' }} />
        </Fab>{' '}

    </>
);
// write a arrow  function that returns a JSX element
const GridItem = ({ car ,brand,model,color ,handleOnEdit ,openDialog ,openDialogView , t }) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    // return the JSX element
    let titleString;

    if (model.includes(brand)) {
        // If model contains the brand, replace it with an empty string
        const modelWithoutBrand = model.replace(brand, "").trim();
        titleString = `${brand}  ${modelWithoutBrand}`;
    } else {
        // If model does not contain the brand, concatenate as usual
        titleString = `${brand}  ${model}`;
    }   
    titleString +=  car?.description ?  ` - ${car?.description}` : '';
    return (
        <>

            <Grid item xs={12} md={6} lg={6} xl={3}>
                <Card sx={{ mb: "15px" }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {brand.substring(3,0)}
                            </Avatar>
                        }
                        titleTypographyProps={{ variant: 'h6' }}
                        title={titleString}
                        subheader={t('cars.date')+": "+ car.firstRegistration   + " | " + t('cars.color')+": " + color}
                    />

                    <CardMedia
                        component="img"
                        height="200"
                        objectfit="cover"
                        image={car?.image[0] ? process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '')+car.image[0] : "/images/No-Image-Placeholder.png"}
                        alt="Paella dish"
                    />
                    <CardContent>

                            <List>

                                {car.mileage && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.mileage')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;{car.mileage} KM
                                    </ListItem>
                                )}
                                {car.fuelType && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.fuel_type')} :</Typography>
                                        &nbsp;&nbsp;&nbsp;{car.fuelType}
                                    </ListItem>
                                )}
                                {car.accidentalDamage && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.accidental_damage')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;{t('cars.'+car.accidentalDamage.toLowerCase())}
                                    </ListItem>
                                )}
                            </List>

                    </CardContent>

                    <CardActions disableSpacing>
                            <ActionButtons
                                onEdit={() => handleOnEdit(car._id)}
                                onDelete={() => openDialog(car)}
                                onView={() => openDialogView(car)}
                            />
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <List>
                                {/*{car.engineNo && (*/}
                                {/*    <ListItem>*/}
                                {/*        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>Engine No:</Typography>*/}
                                {/*        {' '}{car.engineNo}*/}
                                {/*    </ListItem>*/}
                                {/*)}*/}
                                {car.bodyNo && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.body_no')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;{car.bodyNo}
                                    </ListItem>
                                )}
                                {car.plateNo && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.plate_no')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;{car.plateNo}
                                    </ListItem>
                                )}
                                {/*{car.registeredDocumentNo && (*/}
                                {/*    <ListItem>*/}
                                {/*        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>Registered Document No:</Typography>*/}
                                {/*        {' '}{car.registeredDocumentNo}*/}
                                {/*    </ListItem>*/}
                                {/*)}*/}
                                {car.HUAU && (
                                    <ListItem>
                                        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>{t('cars.hu_au')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;{car.HUAU}
                                    </ListItem>
                                )}
                                {/*{car.firstRegistration && (*/}
                                {/*    <ListItem>*/}
                                {/*        <Typography component="span" variant="body1" style={{ fontWeight: 'bold' }}>First Registration:</Typography>*/}
                                {/*        &nbsp;&nbsp;&nbsp;{car.firstRegistration}*/}
                                {/*    </ListItem>*/}
                                {/*)}*/}
                                {car.description && (
                                    <ListItem>
                                        <Typography component="span"  variant="body1" style={{ fontWeight: 'bold' ,width:'100%' ,display : 'contents' }}>{t('cars.description')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;<br />{car.description}
                                    </ListItem>
                                )}
                                {car.accidentalDamageDescription && (
                                    <ListItem>
                                        <Typography component="span" fullWith variant="body1" style={{ fontWeight: 'bold',width:'100%' ,display : 'contents' }}>{t('cars.accidental_damage_description')}:</Typography>
                                        &nbsp;&nbsp;&nbsp;<br />{car.accidentalDamageDescription}
                                    </ListItem>
                                )}
                            </List>


                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        </>
    );
}
// export the function
export default GridItem;
