import React from 'react';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const SearchBar = ({ searchTerm, handleSearchChange ,searchTermInput ,t }) => (
    <Grid container alignItems="center" spacing={2}>
        <Grid textAlign="left"  item  xs={12} md={4} lg={4}   alignItems="flex-start"   >
            <Button
                href={"/en/purchasewithwarranty/add/"}
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
                {t('invoice.purchase_with_warranty')}
            </Button>
        </Grid>

        <Grid item xs={12} md={4} lg={2}    style={{ marginLeft: 'auto' }}>

            <TextField
                name="search"
                value={searchTermInput}
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
