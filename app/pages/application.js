// pages/application.js
import React from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../styles/appbar';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function Application() {
  return (
    <>
      <Head>
        <title>Driver Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResponsiveAppBar />
      <Container>
        <Box mt={4}>
          <Typography variant="h3" gutterBottom>
            Driver Application
          </Typography>
        </Box>
        <form>
          <TextField label="Name" variant="outlined" fullWidth margin="normal" />
          <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" />
          <TextField label="Phone Number" type="tel" variant="outlined" fullWidth margin="normal" />
          <TextField
            label="Why do you want to join our program?"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit Application
            </Button>
          </Box>
        </form>
        <Box mt={2} />
      </Container>
    </>
  );
}