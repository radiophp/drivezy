import React from 'react';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function CustomPaginationCars({ count, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) {
    // Calculate total number of pages
    const totalPages = Math.ceil(count / rowsPerPage);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
            {/* Pagination control */}
            <Pagination
                count={totalPages}
                page={page + 1} // page index is 0-based
                onChange={(event, value) => handleChangePage(event, value - 1)} // Adjust value for 0-based index
            />

            {/* Rows per page selector */}
            <FormControl>
                <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                <Select
                    labelId="rows-per-page-label"
                    id="rows-per-page"
                    value={rowsPerPage}
                    label=t('act.rows_per_page')
                    onChange={handleChangeRowsPerPage}
                >
                    {[10, 25, { label: 'All', value: -1 }].map(option => (
                        <MenuItem key={option.value || option} value={option.value || option}>
                            {option.label || option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default CustomPaginationCars;
