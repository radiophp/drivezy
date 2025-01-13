import React from 'react';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const SearchBar = ({ searchTerm, handleSearchChange ,t }) => (
    <Grid container alignItems="center" spacing={2}>
        <Grid textAlign="left"  item  xs={12} md={4} lg={3}   alignItems="flex-start"   >
            <Button
                href={"/en/models/add/"}
                size={"small"}
                startIcon={<AddIcon sx={{ color: '#fff !important' }} />}
                variant="contained"
                color="primary"
                sx={{
                    textTransform: 'capitalize',
                    borderRadius: '10px',
                    mt: '10px',
                    p: '10px 30px',
                    fontSize: '14px',
                    color: '#fff !important',
                }}
                className="mr-10px"
            >
                {t('cars.add_model')}
            </Button>
        </Grid>

        <Grid item xs={12} md={4} lg={2}    style={{ marginLeft: 'auto' }}>

            <TextField
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}

                fullWidth
                size="small"
                label={t('act.search')}

                InputProps={{
                    style: { borderRadius: 8 },
                }}
            />
        </Grid>
    </Grid>
);

export default SearchBar;
