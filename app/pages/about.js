import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from '@/styles/Home.module.css';
import Layout from '@/Components/Layout';

export default function About() {
  const [value, setValue] = useState(0);
  const [entries, setEntries] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("running on: " + baseUrl);
  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch(`${baseUrl}/api/about_info`);
      const data = await res.json();
      setEntries(data);
    }

    fetchEntries().catch(console.error);
  }, [baseUrl]);

  return (
    <>
      <Head>
        <title>About Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Version" />
          <Tab label="Overview" />
          <Tab label="Mission" />
        </Tabs>
      </Box>

      <main className={styles.main}>
        <div className={styles.description}>
          {value === 0 && (
            <section>
              <header>
                <h1>About Details</h1>
              </header>
              <ul>
                {entries.map((entry, index) => (
                  <li key={index}>
                    <p>Team #: {entry.team}</p>
                    <p>Version: {entry.version}</p>
                    <p>Release Date: {entry.release_date}</p>
                    <p>Product Name: {entry.product_name}</p>
                    <p>Product Description: {entry.product_description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {value === 1 && (
            <section>
              <header>
                <h1>About Us</h1>
              </header>
              <p>
                Welcome to the Good Driver Incentive Program, where we revolutionize how companies encourage
                and reward positive on-road performance among their truck drivers. Our platform empowers sponsors
                to incentivize good driving behaviors by rewarding drivers with points. These points can be
                redeemed from a curated catalog of products, providing a tangible recognition for their commitment
                to safety and excellence.
              </p>
            </section>
          )}

          {value === 2 && (
            <section>
              <header>
                <h2>Our Mission</h2>
              </header>
              <p>
                At the heart of our mission is the commitment to foster a safer and more responsible driving
                culture within the trucking industry. We strive to provide a seamless and rewarding experience
                for both sponsors and drivers, promoting a collaborative environment that values and recognizes
                the importance of good driving practices.
              </p>
            </section>
          )}
        </div>
      </main>
      </Layout>
    </>
  );
}