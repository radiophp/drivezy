import React from 'react';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CollectionsIcon from "@mui/icons-material/Collections";
import Fab from "@mui/material/Fab";

const SearchBar = ({searchTerm, handleSearchChange, t,callFrom ,setFilter,filter}) => (
    <Grid container alignItems="center" spacing={ 2 }>
        <Grid textAlign="left" item xs={ 12 } md={ 4} lg={ 4 } alignItems="flex-start">
            <Button
                href={ "/en/cars/add/" }
                size={ "small" }
                startIcon={ <AddIcon sx={ {color: '#fff !important'} }/> }
                variant="contained"
                color="primary"
                sx={ {
                    textTransform: 'capitalize',
                    borderRadius: '10px',
                    mt: '10px',
                    p: '10px 30px',
                    fontSize: '14px',
                    color:   '#fff !important',
                } }
                className="mr-10px"
            >
                { t('cars.add_car') }
            </Button>
        </Grid>
        <Grid textAlign="right" item xs={ 12 } md={ 4 } lg={ 4 } alignItems="flex-end">
            <Link href="/cars/">
                <Fab
                    color={callFrom === 'list' ? 'secondary':'primary'}
                    aria-label="view"
                    size="small"
                    variant="extended"

                >
                    <FormatListBulletedIcon sx={ {color: '#fff !important'    } }/>
                </Fab>
            </Link>
            <Link href="/cars/grid/">
                <Fab
                    color={callFrom === 'grid' ? 'secondary':'primary'}
                    aria-label="view"
                    size="small"
                    variant="extended"

                >
                    <CollectionsIcon sx={ {color: '#fff !important'} }/>
                </Fab>

            </Link>
        </Grid>



        <Grid item xs={ 12 } md={ 2 } lg={ 2 } style={ {marginLeft: 'auto'} }>
            <Select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                fullWidth
                variant={ "outlined" }
                sx={{
                    height: '38px'
                }}
            >
                <MenuItem value="all">{t('invoice.all')}</MenuItem>
                <MenuItem value="inWarehouse">{t('invoice.in_stock')}</MenuItem>
                <MenuItem value="notInWarehouse">{t('invoice.sold')}</MenuItem>
            </Select>
        </Grid>
        <Grid item xs={ 12 } md={ 2 } lg={ 2 } style={ {marginLeft: '0'} }>

            <TextField
                name="search"
                value={ searchTerm }
                onChange={ handleSearchChange }

                fullWidth
                size="small"
                label={ t('act.search') }

                InputProps={ {
                    style: {borderRadius: 8},
                } }
            />
        </Grid>
    </Grid>
);

export default SearchBar;
