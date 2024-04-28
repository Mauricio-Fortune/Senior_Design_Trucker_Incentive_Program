import React, { useState, useEffect } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import {
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';



export default function Orders_Sponsors({isSpoofing = false, sponsorSpoofID = ''}) {
    const [user, setUser] = useState();
    const [orgID,setOrgID] = useState(0);
    const [orders, setOrders] = useState([
      {
        order_id: 0,
        userID: '',
        name: '',
        points: 0,
        status: '',
        quantity: 0
      }
    ]);

    useEffect(() => {
        async function currentAuthenticatedUser() {
          if (isSpoofing) {
            setUser({sub: sponsorSpoofID});
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
      const fetchOrders = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
          };
      
          const response = await fetch(`/api/driver/get_orders?user_ID=${user.sub}&org_ID=${orgID}`, requestOptions);
      
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          
          const result = await response.json();
      
          const updatedOrders = result.reduce((acc, order) => {
            /**
             * There are multiple items for each order if ordered via cart,
             * each item should be an entry in one order
             */
            const existingOrder = acc.find(o => o.order_id === order.order_ID);
    
            const newItem = {
              itemName: order.item_Name,
              points: order.points,
              quantity: order.item_Quantity
             
            };
      
            if (existingOrder) {
              existingOrder.items.push(newItem);
            } else {
              acc.push({
                order_id: order.order_ID,
                userID: order.user_ID,
                name: order.first_name,
                items: [newItem], 
                status: order.order_Status 
              });
            }
      
            return acc;
          }, []);
      
          setOrders(updatedOrders);
        
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      
      
  

      if(orgID != 0 && user != null)
        fetchOrders();
      }, [orgID]);
    
   
   
    const rejectOrder = async (order) => {

      console.log(`Rejecting ${order.name}'s order`);
      // Add the accepted driver to the sponsored drivers
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          order_ID : order.order_id,
        })
      };
     
      fetch('api/sponsor/post_reject_order', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
  
      // refund points
      const pointOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_ID : order.userID,
          point_change_value : order.points,
          reason: "Refund order", 
          org_ID: orgID,
          timestamp: "timestamp"
        })
      };
      fetch('/api/sponsor/edit_points', pointOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));


    };
    
    

    return (
        <>
          <div>
            <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
              Your Orders
            </Typography>
            {orders.map((order) => (
              <Card key={order.order_id} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h6">Order #: {order.order_id}</Typography>
                  <Typography variant="body1">
                    Items: {order.items && order.items.map(item => `${item.itemName} (${item.quantity})`).join(', ')}
                    </Typography>
                  <Typography variant="body1">
                    Total Points: {order.items && order.items.reduce((total, item) => total + item.points, 0)}
                  </Typography>
                  <Typography variant="body1">Order Status: {order.status}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => rejectOrder(order)}
                    style={{ marginTop: '8px' }}
                  >
                    Cancel Order
                  </Button>
                </CardContent>
              </Card>
            ))}

          </div>
        </>
    );
}
