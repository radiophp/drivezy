
import React, { useState ,useEffect} from 'react';
import { useGetDynamicInvoiceQuery } from '@/redux/slices/reportsApiSlice';  // Importing the new hook
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox for field selection
import Button from '@mui/material/Button'; // Import Button for form submission
import Card from '@mui/material/Card'; // Import Card component
import CardContent from '@mui/material/CardContent'; // Card content component
import TextField from '@mui/material/TextField'; // Import TextField for date input
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import useTranslation from "next-translate/useTranslation";
import {FileDownload} from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress"; // Import Typography for field labels
const carFields = [
    'brand', 'color', 'model',  'bodyNo',
    'mileage', 'plateNo', 'fuelType',
    'HUAU', 'firstRegistration', 'accidentalDamage', 'buyPrice',
];

const DynamicCars = () => {
    const { t, lang } = useTranslation('common');
    const [date, setDate] = useState(null); // State for the selected date

    const [selectedFields, setSelectedFields] = useState([]);
    const [data, setData] = useState(null);
    const [fetchData, setFetchData] = useState(false);
    const [urlData, setUrlData] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    // Handle change in checkbox
    const handleFieldChange = (field) => {
        setSelectedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field)
                : [...prevFields, field]
        );
    };
    const toSnakeCase= (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setFetchData(true); // Set flag to trigger data fetching
    };

    // Using the hook conditionally based on fetchData
    const { data: apiData, ...queryInfo  } = useGetDynamicInvoiceQuery({ fields: selectedFields , date:date ,buttonClicked }, { skip: !fetchData });
    const { isLoading: creationLoading, isSuccess } = queryInfo;
    // Update local state when data is fetched successfully
    useEffect(() => {
        if (isSuccess) {
            setData(apiData);
            setUrlData(apiData?.url);
            setButtonClicked(false);
            setSubmitClicked(false);
            console.log("success agin",apiData)
            setFetchData(false); // Reset flag after fetching data
        }
    }, [apiData, isSuccess,creationLoading]);

    const handleButtonClick = () => {
        setButtonClicked(true);
    };
    return (
        <div>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" sx={{ fontWeight: "500", fontSize: "14px", mb: "12px" }}>
                                    {t('act.date')}
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={date}
                                        onChange={(newValue) => setDate(newValue.format('YYYY/MM/DD'))}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} >
                                {" "}
                            </Grid>

                            {carFields.map(field => (
                                <Grid item xs={12} sm={3} key={field}>
                                    <Checkbox
                                        checked={selectedFields.includes(field)}
                                        onChange={() => handleFieldChange(field)}
                                    />
                                    {t('cars.'+toSnakeCase(field))}
                                </Grid>
                            ))}
                            {urlData &&   !buttonClicked  && (
                                <Grid textAlign="center" item xs={12} alignItems="flex-start">
                                    <Button
                                        onClick={handleButtonClick}
                                        href={process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '') + urlData}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size={"small"}
                                        startIcon={<FileDownload sx={{ color: '#fff !important' }} />}
                                        variant="contained"
                                        color="danger"
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
                                        {t('invoice.download_as_pdf')}
                                    </Button>
                                </Grid>
                            )}

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '20px'  }}
                                        fullWidth
                                        disabled={creationLoading} // Disable the button when loading
                                        startIcon={creationLoading ? null : <AddCircleIcon/>} // Hide icon when loading
                                        onClick={() => {(setSubmitClicked(true))}}
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
            {/*{data?.cars && (*/}
            {/*    <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 25px 10px", mb: "15px" }}>*/}
            {/*        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>*/}
            {/*        <Table>*/}
            {/*            <TableHead>*/}
            {/*                <TableRow>*/}
            {/*                    {selectedFields.map(field => (*/}
            {/*                        <TableCell key={field}>{t('cars.'+toSnakeCase(field))}</TableCell>*/}
            {/*                    ))}*/}
            {/*                </TableRow>*/}
            {/*            </TableHead>*/}
            {/*            <TableBody>*/}
            {/*                {data?.cars.map((row, index) => (*/}
            {/*                    <TableRow key={index}>*/}
            {/*                        {selectedFields.map(field => (*/}
            {/*                            <TableCell key={field}>{row[field]}</TableCell>*/}
            {/*                        ))}*/}
            {/*                    </TableRow>*/}
            {/*                ))}*/}
            {/*            </TableBody>*/}
            {/*        </Table>*/}
            {/*        </TableContainer>*/}
            {/*    </Card>*/}
            {/*)}*/}
        </div>
    );
};

export default DynamicCars;
