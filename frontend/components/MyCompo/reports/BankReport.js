import React, { useState, useEffect } from 'react';
import { useGetWarehouseInvoiceQuery } from '@/redux/slices/reportsApiSlice';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchBar from './SearchBar'; // Import SearchBar component
import Pagination from './Pagination'; // Import Pagination component
import useTranslation from "next-translate/useTranslation";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import TextField from '@mui/material/TextField'; // Import TextField for date input
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from '@mui/material/CircularProgress';

const BankReport = () => {
    const { t, lang } = useTranslation('common');
    const [date, setDate] = useState(null); // State for the selected date
    const [triggerQuery, setTriggerQuery] = useState(false); // New state to control query triggering
    // Correctly destructure the data and meta-information from the query
    const { data: apiData, ...queryInfo } = useGetWarehouseInvoiceQuery({ date: date }, { skip: !triggerQuery });
    const { isLoading: creationLoading, isSuccess } = queryInfo;
    const [data, setData] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [urlData, setUrlData] = useState('');

    // Update local state when data is fetched successfully
    useEffect(() => {
        if (isSuccess) {
            setData(apiData);
            console.log(data);
            setTriggerQuery(false); // Reset trigger after fetching data
        }
    }, [apiData, isSuccess]);

    useEffect(() => {
        if (data) {
            setUrlData(data.url);
            const filtered = data.data
                .filter(item => !item.URL)
                .filter(item =>
                    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    item.bodyNo.toLowerCase().includes(searchTerm.toLowerCase())
                );
            setFilteredData(filtered);
        }
    }, [data, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page on search
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setTriggerQuery(true); // Set trigger to true to trigger data fetching
    };

    // Calculate the current page data
    const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                    Date
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={date}
                                        onChange={(newValue) => setDate(newValue.format('YYYY/MM/DD'))}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    style={{ marginTop: '40px' }}
                                    fullWidth
                                    disabled={creationLoading} // Disable the button when loading
                                    startIcon={creationLoading ? null : <AddCircleIcon />} // Hide icon when loading
                                >
                                    {creationLoading ?
                                        <CircularProgress size={24} /> : // Show loading spinner when loading
                                        t('act.build_report') // Show text otherwise
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <br />
            {data && (
                <Card
                    sx={{
                        boxShadow: "none",
                        borderRadius: "10px",
                        p: "25px 25px 10px",
                        mb: "15px",
                    }}
                >
                    <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} t={t} downloadURL={urlData} />
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: "none",
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>{t('cars.brand') + " " + t('cars.model') + " " + t('cars.color')}</TableCell>
                                    <TableCell>{t('cars.body_no')}</TableCell>
                                    <TableCell>{t('act.created_at')}</TableCell>
                                    <TableCell>{t('cars.buy_price')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentPageData.map((item, index) => (
                                    <TableRow key={item.car._id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{`${item.brand} - ${item.model} ${item.color ? `- ${item.color}` : ''}`}</TableCell>
                                        <TableCell>{item.bodyNo}</TableCell>
                                        <TableCell>{item.car.createdAt}</TableCell>
                                        <TableCell>{item.car.updatedAt}</TableCell>
                                        <TableCell>{item.car.buyPrice || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <Pagination
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                t={t}
                            />
                        </Table>
                    </TableContainer>
                </Card>
            )}
        </>
    );
};

export default BankReport;
