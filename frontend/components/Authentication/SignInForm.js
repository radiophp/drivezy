import React from "react";
import Link from "next/link";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useLoginMutation } from '/redux/slices/authApiSlice'; // Adjust the path to import the useLoginMutation hook
import { logout } from '/redux/slices/authSlice';
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/components/Authentication/Authentication.module.css";
import useTranslation from "next-translate/useTranslation";
import FormHelperText from "@mui/material/FormHelperText";

const SignInForm = () => {
    const { t, lang } = useTranslation('common');
    const dispatch = useDispatch();
    const router = useRouter(); // Initializing useRouter
    const [login, { isLoading, isError, error }] = useLoginMutation(); // Using the useLoginMutation hook
    const [errors, setErrors] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            // Calling the login mutation with user credentials
            const response = await login({
                email: data.get('email'),
                password: data.get('password'),
            }).unwrap();

            // Logging the token to console

            // If login is successful, redirect to the dashboard
            router.push('/dashboard'); // Adjust the path as per your application's route structure

        } catch (error) {
            console.error('Failed to login', error);
            setErrors(t("act.wrong_email_or_password"));
            // Handle login error, for example, showing an error message to the user
        }
    };

    // If needed, you can also handle logout by calling dispatch(logout())


  return (
    <>
      <div className="authenticationBox">
        <Box
          component="main"
          sx={{
            maxWidth: "510px",
            ml: "auto",
            mr: "auto",
            padding: "50px 0 100px",
          }}
        >
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Box>


              <div className={styles.or}>

                  <Link href='/'>
                      <img
                          src="/images/Drivezy_Mix.png" alt="Logo"
                          className='black-logo'
                      />

                      {/* For Dark Variation */}
                      <img
                          src="/images/Drivezy_Mix.png" alt="Logo"
                          className='white-logo'
                      />
                  </Link>

              </div>

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>

                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                          {t('user.email')}
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        id="email"
                        label={t('user.email')}
                        name="email"
                        autoComplete="email"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                          {t('user.password')}
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        name="password"
                        label={t('user.password')}
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                      <Grid item xs={12}>
                      <FormHelperText error={errors}  >{errors}</FormHelperText>
                      </Grid>
                  </Grid>
                    <br/>
                    {/*<Grid item xs={6} sm={6} textAlign="left">*/}
                    {/*    <Link*/}
                    {/*        href="/admash/authentication/forgot-password"*/}
                    {/*        className="primaryColor text-decoration-none"*/}
                    {/*    >*/}
                    {/*        Forgot your password?*/}
                    {/*    </Link>*/}
                    {/*</Grid>*/}
                </Box>

                <Grid container alignItems="center" spacing={2}>
                  {/*<Grid item xs={6} sm={6}>*/}
                  {/*  <FormControlLabel*/}
                  {/*    control={*/}
                  {/*      <Checkbox value="allowExtraEmails" color="primary" />*/}
                  {/*    }*/}
                  {/*    label="Remember me."*/}
                  {/*  />*/}
                  {/*</Grid>*/}


                </Grid>


                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    padding: "12px 10px",
                    color: "#fff !important",
                  }}
                >
                    {t('user.signIn')}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default SignInForm;
