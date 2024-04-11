// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DriversPage from './drivers'; // Assuming the file name is drivers.js
import SponsorsPage from './sponsors'; // Assuming the file name is sponsors.js
import AdminsPage from './admins'; // Assuming the file name is admins.js
import AdminDriverPage from './adminDriver';
import ProtectedLayout from '@/Components/ProtectedLayout';

function Dashboard() {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate userType check locally
    const userTypeFromLocalStorage = localStorage.getItem('userType');
  
    // Set userType to "driver", "sponsor", or "admin" based on simulated userType
    setUserType(
      userTypeFromLocalStorage === "driver" ? "driver" :
      userTypeFromLocalStorage === "sponsor" ? "sponsor" :
      userTypeFromLocalStorage === "admin" ? "admin" : null
    );
  
    // Print current userType to console
    console.log("Current userType:", userTypeFromLocalStorage);
  
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedLayout>
      {/* Render appropriate component based on userType */}
      {userType === "driver" && <DriversPage />}
      {userType === "sponsor" && <SponsorsPage />}
      {userType === "admin" && (
        <>
          <AdminDriverPage />
          <div style={{ marginBottom: '20px' }}></div>
          <SponsorsPage />
          <div style={{ marginBottom: '20px' }}></div>
          <AdminsPage />
          <div style={{ marginBottom: '20px' }}></div>
        </>
      )}
      {/* If userType is neither "driver", "sponsor", nor "admin", you can render some other default component or redirect to another page */}
      {(!userType || !["driver", "sponsor", "admin"].includes(userType)) && (
        <div>
          <h1>Welcome to the Dashboard</h1>
          <p>User Type: {userType}</p>
          {/* You can render other components or elements here */}
        </div>
      )}
    </ProtectedLayout>
  );
}

export default Dashboard;
