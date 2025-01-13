import Grid from "@mui/material/Grid";
import Link from 'next/link';
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import React from "react";
import {NoCrash} from "@mui/icons-material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import useTranslation from "next-translate/useTranslation";
import CardContent from "@mui/material/CardContent";

import styles from "./index.module.css";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CollectionsIcon from '@mui/icons-material/Collections';
const FeaturesData = [

    {
        title: "cars",
        path: "/cars/",
        icon: <NoCrash sx={ {fontSize: 35} }/>,
        add: "/cars/add/",
        third: {title: 'dashboard.gallery', path: "/cars/grid/", icon: <CollectionsIcon sx={ {fontSize: 35} }/>},

    },
    {
        title: "customers",
        path: "/customers/",
        icon: <PersonPinIcon sx={ {fontSize: 35} }/>,
        add: "/customers/add/"
    },
    {
        title: "commission_agreement",
        path: "/comagree/",
        icon: <LocalOfferIcon sx={ {fontSize: 35} }/>,
        add: "/comagree/add/"
    },
    {
        title: "purchase_with_warranty",
        path: "/purchasewithwarranty/",
        icon: <LocalOfferIcon sx={ {fontSize: 35} }/>,
        add: "/purchasewithwarranty/add/"
    },
    {
        title: "netto",
        path: "/nettoInvoice/",
        icon: <LocalOfferIcon sx={ {fontSize: 35} }/>,
        add: "/nettoInvoice/add/"
    },
    {
        title: "dfz",
        path: "/dfzInvoice/",
        icon: <LocalOfferIcon sx={ {fontSize: 35} }/>,
        add: "/dfzInvoice/add/"
    },
    {
        title: "mwst",
        path: "/mwstInvoice/",
        icon: <LocalOfferIcon sx={ {fontSize: 35} }/>,
        add: "/mwstInvoice/add/"
    },


];
const LMSCourses = () => {
    const {t, lang} = useTranslation('common');
    return (

        <>
            <Card>
                <CardContent>
                    <Grid
                        container
                        justifyContent="left"
                        rowSpacing={ 1 }
                        columnSpacing={ {xs: 1, sm: 2, md: 2} }
                    >
                        { FeaturesData.map((feature, index) => (
                            <Grid item xs={ 12 } sm={ 6 } md={ 6 } lg={ 6 } xl={ 4 } key={ index }>
                                <Card
                                    sx={ {
                                        boxShadow: "none",
                                        borderRadius: "10px",
                                        p: "25px",
                                        mb: "15px",
                                        textDecoration: 'none'
                                        backgroundColor: '#564c4c',
                                    } }
                                >

                                    <Box
                                        sx={ {
                                            display: "flex",
                                            alignItems: "left",
                                            textAlign:"left",
                                        } }
                                    >
                                        <Box
                                            sx={ {

                                                borderRadius: "100%",
                                                color: "#f5f5f5"
                                            } }
                                            className="mr-15px"
                                        >
                                            { feature.icon }
                                        </Box>
                                        <Box>

                                            <Box

                                                className={ styles.dashboardText }
                                            >
                                                { t('dashboard.' + feature.title) }
                                            </Box>


                                            <Box className={ styles.linkContainer }>

                                                <Link
                                                    href={ feature.add }
                                                    key={ "lnk" + index }
                                                    className={ styles.dashboardLink }
                                                >
                                                    <AddIcon></AddIcon>{ " " } { t('act.add') }
                                                </Link>
                                                { " " }
                                                { " " }
                                                { " " }

                                                { " " }
                                                <Link
                                                    href={ feature.path }
                                                    key={ "lnk" + index }
                                                    className={ styles.dashboardLink }
                                                >
                                                    <FormatListBulletedIcon></FormatListBulletedIcon>{ " " } { t('act.list') }
                                                </Link>
                                                { feature?.third && (
                                                    <Link
                                                        href={ feature.third.path }
                                                        key={ "lnk" + index }
                                                        className={ styles.dashboardLink }
                                                        >
                                                        {feature.third.icon}   { " " } { t(feature.third.title) }
                                                        </Link>
                                                )}
                                        </Box>
                                    </Box>


                                </Box>

                            </Card>
                            </Grid>
                            )) }
                    </Grid>
                </CardContent>
            </Card>
        </>


    );
}
export default LMSCourses;
