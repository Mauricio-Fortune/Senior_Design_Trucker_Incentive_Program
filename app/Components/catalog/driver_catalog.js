

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { ElevatorSharp } from '@mui/icons-material';


export default function Catalog_Manage({isSpoof = false, spoofId = null}) {
  const [entries, setEntries] = useState([]);
  const [quantityType, setQuantityType] = useState(1);
  const [detailedItemData, setDetailedItemData] = useState({});
  const [driverPoints, setDriverPoints] = useState(0);
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState();
  const [order_ID, setOrderID] = useState();
  const [cart_ID, setCart] = useState(0);
  const [pointRatio, setPointRatio] = useState(0);
  

  const [orderItem, setorderItem] = useState({
      itemID: '',
      name: '',
      quantity: 0,
      points: 0
  });

  const [cartItem, setCartItem] = useState({
    itemID: '',
    name: '',
    quantity: 0,
    points: 0
  });



  // cart orders

  const addCartItem = async (item_ID) => {
    const item = detailedItemData[item_ID];
    const itemDetails = {
      itemID: item_ID,
      name: getName(item), 
      quantity: quantityType,
      points: Math.round(getPoints(item) * pointRatio * quantityType) 
    };
    setCartItem(itemDetails); 

  };


  useEffect(() => {

    const addToCart = async (cartID) => {
      try{
          const requestOptions = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
          },
            body: JSON.stringify({ 
            order_ID : cartID,
            item_ID : cartItem.itemID,
            item_Quantity: cartItem.quantity,
            item_Name: cartItem.name,
            points: cartItem.points
          })
        };
          console.log("Cart Order ID oisfdn: " + cartID);
          console.log("Item: " + cartItem.itemID);
          console.log("Quantity: " + cartItem.quantity);
          console.log("Name: " + cartItem.name);
          console.log("Points: " + cartItem.points);


        if(cartID != -1 && cartID != 0){

       
        const response = await fetch('/api/driver/post_add_items_to_order', requestOptions);
  
        console.log("added item "+ cartItem.itemID + " to cart "+ cartID);
    
        alert("Added item to your cart!");
      }

    } catch (error) {
      console.error(`Error adding item to order ${order_ID}`, error);
    }
  };
    
    const createCartOrder = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: user.sub,
          is_cart: 1,
          org_ID: orgID
        })
    };
    const response = await fetch(`/api/driver/post_new_order`, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();
    
  
    setCart(result.order_ID);

    };

    const getCartID = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`/api/driver/get_cart_orderID?user_ID=${user.sub}&org_ID=${orgID}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        if(result.order_ID != -1 && result.order_ID != 0){
          addToCart(result.order_ID);
        }
        else {
          createCartOrder();
        }
       
      } catch (error) {
        console.error(`Error getting cart order_ID for user: ${user.sub}`, error);
      }
    };
      
    if(user != null && cartItem != null){
      getCartID();
      if(cart_ID == -1)
        createCartOrder();

    }
  }, [cartItem]);


  
  useEffect(() => {
    const addToCart = async () => {
      try{
          const requestOptions = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
          },
            body: JSON.stringify({ 
            order_ID : cart_ID,
            item_ID : cartItem.itemID,
            item_Quantity: cartItem.quantity,
            item_Name: cartItem.name,
            points: cartItem.points
          })
        };
        


          if(cart_ID != -1 && cart_ID != 0){

            const response = await fetch('/api/driver/post_add_items_to_order', requestOptions);
      
            console.log("added item "+ cartItem.itemID + " to cart "+ cart_ID);
        
            alert("Added item to your cart!");
          }
      

    } catch (error) {
      console.error(`Error adding item to order ${order_ID}`, error);
    }
  }

  if(user != null && cart_ID != null && cartItem != null && cart_ID != -1 && cartItem.itemID != 0 && cartItem != '')
    addToCart();  
  }, [cart_ID]);
  



// individual orders
const addOrderItem = async (item_ID) => {
  const item = detailedItemData[item_ID];
  const itemDetails = {
    itemID: item_ID,
    name: getName(item), 
    quantity: quantityType,
    points: Math.round(getPoints(item)) * pointRatio * quantityType
  };
  console.log("point for item: " + Math.round(getPoints(item)) * pointRatio * quantityType) ;

  if(Math.round(getPoints(item)) * pointRatio * quantityType > driverPoints){
    alert("Not Enough Points!");
  }
  else{
    setorderItem(itemDetails); 
  }
  
};

useEffect(() => {
  const createNewOrder = async () => { // fetches all itemIDs in database
    try {
        const requestOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            is_cart: 0,
            org_ID: orgID
          })
      };
      const response = await fetch(`/api/driver/post_new_order`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      
    
      setOrderID(result.order_ID);

      console.log("Created order: " + result.order_ID);
        


    } catch (error) {
      console.error('Failed to fetch data:', error);
      setOrderID([0]);
    }
  };

    if(user != null && orderItem != null && orderItem.itemID != 0){
      createNewOrder();
    
  }

}, [orderItem]);

useEffect(() => {
  const completeOrder = async () => {
    try{
        const requestOptions = {
          method: "POST",
          headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({ 
          order_ID : order_ID,
          item_ID : orderItem.itemID,
          item_Quantity: orderItem.quantity,
          item_Name: orderItem.name,
          points: orderItem.points
        })
      };

      const response = await fetch('/api/driver/post_add_items_to_order', requestOptions);

      console.log("added item "+ orderItem.itemID + " to order "+ order_ID);
  


        const pointOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            user_ID : user.sub,
            point_change_value : -orderItem.points,
            reason: "order", 
            org_ID: orgID,
            timestamp: "timestamp"
          })
        };
    const pointchange = await fetch('/api/sponsor/edit_points', pointOptions);

    alert("Ordered Item!");
  } catch (error) {
    console.error(`Error adding item to order ${order_ID}`, error);
  }
}
if(user != null && orderItem != null && orderItem.itemID != 0 && orderItem != '')
  completeOrder();  
}, [order_ID]);



  useEffect(() => {
    const getDriverPoints = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        if(user == null){
          currentAuthenticatedUser();
        }
        
        const response = await fetch(`/api/driver/get_driver_points?user_ID=${user.sub}&org_ID=${orgID}`, requestOptions);
        if (!response.ok) throw new Error('Failed to fetch item data');
        
    
        
        const data = await response.json();   
        return data.totalPoints; 
      } catch (error) {
        console.error('Failed to fetch item data:', error);
        return 0; 
      }
  };
  const getPointRatio = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
  
      const response = await fetch(`api/sponsor/get_point_ratio?org_ID=${orgID}`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      
      const data = await response.json(); // Convert response to JSON
      setPointRatio(data.point_Ratio); // Assuming the data is in the format you need; otherwise, you might need data.someProperty
  
    } catch (error) {
      console.error('Error Getting Point Ratio', error);
      setPointRatio(0); // Set to 0 or another default value in case of error
    }
  };
   
    const fetchData = async () => { // fetches all itemIDs in database
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
  
        const response = await fetch(`/api/catalog/get_items_from_org?org_ID=${orgID}`, requestOptions);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const result = await response.json();
  
        if (Array.isArray(result)) { // Assuming the API directly returns an array
          setEntries(result);
        } else {
          console.error('Expected results to be an array but got:', result);
          setEntries([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setEntries([]);
      }
    };

    fetchData();

    if(orgID != null)
    getPointRatio();

    if (user) {
      (async () => {
        const driverPoints = await getDriverPoints();
        if (driverPoints != null) {
          setDriverPoints(driverPoints);
        }
      })();
    }
  }, [orgID]);


  useEffect(() => {
    const getOrgID = async () => { // fetches all itemIDs in database
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
    async function currentAuthenticatedUser() {
      if (isSpoof) {
        setUser({
          sub: spoofId
        })
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
    const getItemData = async (itemID) => { // gets item data from iTunes
      try {
        
        const response = await fetch(`/api/catalog/get_lookup?item_ID=${itemID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item data: ${response.statusText}`);
        }
        const data = await response.json(); // Parse the JSON from the response
        return data;
      } catch (error) {
        console.error('Failed to fetch item data:', error);
        return null;
      }
    };



    const fetchItemDetails = async () => {
      
      const detailsPromises = entries.map(entry => getItemData(entry.item_ID)); 
      const detailsResults = await Promise.all(detailsPromises);
  
      const detailsObject = detailsResults.reduce((acc, detail, index) => {
        if (detail) { 
          const itemID = entries[index].item_ID;
          acc[itemID] = detail;
        }
        return acc;
      }, {});
  
      setDetailedItemData(detailsObject);
    };
  
    if (entries.length > 0) {
      fetchItemDetails();
    }
  }, [entries]); // Depends on `entries`
  
  const handleLimitTypeChange = (event) => {
    setQuantityType(Number(event.target.value)); // Convert to number if it's ensured to be numeric
  };


         //pull item Name from specific type
  const getName = (item) => {
  
    if (item.kind === "song" || item.kind === "podcast" || item.kind === "feature-movie" || item.kind === "ebook") {
      return item.trackName;
    } else if (item.collectionType === "Album" || item.wrapperType === "audiobook") {
      return item.collectionName;
    } 
    else {
      if(item.trackID != null){
        return item.trackName;
      }
      else if (item.collectionID != null){
          return item.collectionName;
      }
      return item.artistName;
    }
  };

  const getPoints = (item) => {
  
    if (item.kind === "song" || item.kind === "podcast" || item.kind === "feature-movie" ) {
      return item.trackPrice;
    } else if (item.collectionType === "Album" || item.wrapperType === "audiobook") {
      return item.collectionPrice;
    } else if( item.kind === "ebook"){
      return item.price;
    }
    else {
      if(item.trackID != null){
        return item.trackPrice;
      }
      else if (item.collectionID != null){
          return item.collectionPrice;
      }
      return 1;
    }
  };

        //pull item ID from specific type
    const getID = (item) => {
      if (item.kind === "song" || item.kind === "podcast" || item.kind === "feature-movie" || item.kind === "ebook") {
        return item.trackId;
      } else if (item.collectionType === "Album" || item.wrapperType === "audiobook") {
        return item.collectionId;
      } 
      else {
        if(item.trackID != null){
          return item.trackID;
        }
        else if (item.collectionID != null){
            return item.collectionID;
        }
        return item.artistId;
      }
    };


// different types of json from itunes
    const SongItem = ({ song }) => (
      <div>
        <div>Type: Song</div>
        <img src={song.artworkUrl100} alt="Song Artwork" style={{ width: 100, height: 100 }} />
        <div>Title: {song.trackName}</div>
        <div>Artist: {song.artistName}</div>
        <div>Album: {song.collectionName}</div>
        <div>Genre: {song.primaryGenreName}</div>
        <div>Points: {Math.round(song.trackPrice) * pointRatio}</div>
      </div>
    );
  const AlbumItem = ({ album }) => (
    <div>
      <div>Type: Album</div>
      <img src={album.artworkUrl100} alt="Album Artwork" style={{ width: 100, height: 100 }} />
      <div>Album: {album.collectionName}</div>
      <div>Artist: {album.artistName}</div>
      <div>track Count: {album.trackCount}</div>
      <div>Genre: {album.primaryGenreName}</div>
      <div>Points: {Math.round(album.collectionPrice)* pointRatio}</div>
    </div>
  );
  
  const PodcastItem = ({ podcast }) => (
    <div>
      <div>Type: Podcast</div>
      <img src={podcast.artworkUrl100} alt="Podcast Artwork" style={{ width: 100, height: 100 }} />
      <div>Podcast: {podcast.collectionName}</div>
      <div>Artist: {podcast.artistName}</div>
      <div>Genre: {podcast.primaryGenreName}</div>
      <div>Points: {Math.round(podcast.trackPrice)* pointRatio}</div>
    </div>
  );
  
  const AudiobookItem = ({ audiobook }) => (
    <div>
      <div>Type: Audiobook</div>
      <img src={audiobook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {audiobook.collectionName}</div>
      <div>Author: {audiobook.artistName}</div>
      <div>Genre: {audiobook.primaryGenreName}</div>
      <div>Points: {Math.round(audiobook.collectionPrice)* pointRatio}</div>
    </div>
  );
  
  const MovieItem = ({ movie }) => (
    <div>
      <div>Type: Movie</div>
      <img src={movie.artworkUrl100} alt="Movie Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {movie.trackName}</div>
      <div>Director: {movie.artistName}</div>
      <div>Genre: {movie.primaryGenreName}</div>
      <div>Rating: {movie.contentAdvisoryRating}</div>
      <div>Points: {Math.round(movie.trackPrice)* pointRatio}</div>
    </div>
  );
  const EbookItem = ({ ebook }) => (
    <div>
      <div>Type: Ebook</div>
      <img src={ebook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {ebook.trackName}</div>
      <div>Author: {ebook.artistName}</div>
      <div>Points: {Math.round(ebook.price)* pointRatio}</div>
  </div>
  );
  
  const MiscItem = ({ misc }) => (
    <div>
      <div>Title: {misc.trackName}</div>
      <div>Artist: {misc.artistName}</div>
  </div>
  );
  
  function renderEntryComponent(itemID) {
    
     const entry = detailedItemData[itemID];
    if(entry){
      if (entry.kind == "song") {
            return <SongItem song={entry} />;
        } else if (entry.collectionType == "Album") {
            return <AlbumItem album={entry} />;
        } else if (entry.kind == "podcast"){
            return <PodcastItem podcast = {entry} />;
        } else if (entry.wrapperType == "audiobook"){
            return <AudiobookItem audiobook = {entry} />;
        } else if (entry.kind == "feature-movie"){
            return <MovieItem movie = {entry} />;
        } else if (entry.kind == "ebook"){
            return <EbookItem ebook = {entry} />;
        } else {
          return <MiscItem misc = {entry} />;
        }
    }
     
    }
    const dropdown_menu_style = {
      marginRight: '10px',
      fontSize: '20px',
      padding: '10px',
      width: '125px',
    }
    const button_style = {
      fontSize: '18px',
      padding: '10px 20px', 
      minWidth: '100px', 
      minHeight: '40px', 
      cursor: 'pointer',
    }
  return (
    <div>
      <Typography variant="h4" gutterBottom component="div" align = "center">
        Store
      </Typography>
      <Typography variant="h6" gutterBottom component="div" align="center">
        Your Points: {driverPoints}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.item_ID}>
                  <TableCell align = "center">
                        {renderEntryComponent(entry.item_ID)}
                        <button onClick={() => addOrderItem(entry.item_ID)} style = {button_style}>Order</button>
                        <button onClick={() => addCartItem(entry.item_ID)} style = {button_style}>Add to Cart</button>
                        <select value={quantityType} onChange={handleLimitTypeChange} style={dropdown_menu_style}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                        </select>
                  </TableCell>
            </TableRow>
            ))}
      </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

