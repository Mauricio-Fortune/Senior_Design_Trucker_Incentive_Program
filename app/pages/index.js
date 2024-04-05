// pages/index.js
import React from 'react';
import Head from 'next/head';
import Layout from '@/Components/Layout';

function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <main>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div
            style={{
              border: '2px solid #333',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
              overflow: 'hidden',
            }}
          >
            <img
              src="/truck.png"
              alt="Truck"
              style={{
                maxWidth: '100%',
                display: 'block',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '2em', // Increase font size
              fontWeight: 'bold',
              fontFamily: 'cursive', // Use a different font family
              marginTop: '20px', // Increase top margin for separation
              paddingBottom: '20px', // Increase bottom padding
            }}
          >
            You Drive, We Buy
          </p>
        </div>
        {/* Your additional content goes here */}
      </main>
      </Layout>
    </>
  );
}

export default Home;