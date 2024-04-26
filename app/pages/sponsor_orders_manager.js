import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { Container, 
    Typography, 
    TextField, 
    Button, 
    Box,
    MenuItem,
    FormControl,
    InputLabel, 
    Select 
    } from '@mui/material';




export default function Orders_Sponsors({isSpoofing = false, sponsorSpoofID = ''}) {
    const [user, setUser] = useState();
    const [orgID,setOrgID] = useState(0);
    const [orders, setOrders] = useState([
      {
        order_id: 0,
        userID: '',
        name: '',
        email: '',
        points: 0
      }
    ]);

    useEffect(() => {
        async function currentAuthenticatedUser() {
          if (isSpoofing) {
            setUser(sponsorSpoofID);
            console.log("spoof id for sponsor: ", sponsorSpoofID);
          }
          else {
            try {
              const user = await fetchUserAttributes();
              setUser(user);
            } catch (err) {
              console.log(err);
            }
          }
        }
        currentAuthenticatedUser();
      }, []);
 
      useEffect(() => {
    
        const getOrgID = async () => { 
          try {
            const requestOptions = {
              method: "GET",
              headers: {
                'Content-Type': 'application/json'
              }
            };
          
            const response = await fetch(`/api/driver/get_current_sponsor?user_ID=${user.sub}`, requestOptions);
      
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            
            setOrgID(result.org_ID);
          } catch (error) {
            console.error('Failed to fetch data:', error);
            setOrgID([]);
          }
        };
        if (user) {
          (async () => {
            const orgID = await getOrgID();
            if (orgID != null) {
              setOrgID(orgID);
            }
          })();
        }
      
      }, [user]); 
      

    useEffect(() => {




      }, [orgID]);
    
   
    
    

    return (
        <>

        </>
    );
}
