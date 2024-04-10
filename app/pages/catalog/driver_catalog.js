

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { fetchUserAttributes } from '@aws-amplify/auth';


export default function Catalog_Manage() {
  const [entries, setEntries] = useState([]);
  const [quantityType, setQuantityType] = useState(1);
  const [detailedItemData, setDetailedItemData] = useState({});
  const [driverPoints, setDriverPoints] = useState(0);
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState();
  const [order_ID, setOrderID] = useState();
  const [cart_ID, setCart] = useState(-1);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



  useEffect(() => {
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
  }, [orgID]);


  const createNewOrder = async (cart) => { // fetches all itemIDs in database
    try {
        const requestOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            is_cart: cart
          })
      };
      console.log("USER " + user.sub);
      const response = await fetch(`/api/driver/post_new_order`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      if(cart == true){
        setCart(result.order_ID);
      }
        setOrderID(result.order_ID);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setOrderID([]);
    }
  };


 
  useEffect(() => {
    const getOrgID = async () => { // fetches all itemIDs in database
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        console.log("USER " + user.sub);
        const response = await fetch(`/api/driver/get_current_sponsor?user_ID=${user.sub}`, requestOptions);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        
        setOrgID(result.org_ID);
        //console.log("result.org_ID = " + result.org_ID);
        //console.log("orgID = " + orgID);
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




  const handleLimitTypeChange = (event) => {
    setQuantityType(Number(event.target.value)); // Convert to number if it's ensured to be numeric
  };


  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes(); // Assuming this correctly fetches the user
        setUser(user); // Once the user is set, it triggers the useEffect for getDriverPoints
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);
  
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
   
        const response = await fetch(`/api/driver/get_driver_points?user_ID=${user.sub}`, requestOptions);
        if (!response.ok) throw new Error('Failed to fetch item data');
        
    
        
        const data = await response.json();
        console.log(data.totalPoints);
   
        return data.totalPoints; 
      } catch (error) {
        console.error('Failed to fetch item data:', error);
        console.log(user);
        return 0; 
      }
  };
    // This now depends on the user state. Once the user is fetched and set, this runs.
    if (user) {
      (async () => {
        const driverPoints = await getDriverPoints();
        if (driverPoints != null) {
          setDriverPoints(driverPoints);
        }
      })();
    }
  }, [user]); // Depend on user state
  
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
  



  


    const getCartID = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        console.log("USER " + user.sub);
        const response = await fetch(`/api/driver/get_cart_orderID?user_ID=${user.sub}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setCart(result.order_ID);
        return result.order_ID; // Return the new cart_ID
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setCart(-1);
        return -1; // Return -1 on failure
      }
    };

  const order_item = async (itemID,cart) => {
    const item = detailedItemData[itemID];

    if(cart == true){
      try{

        const cart_ID = await getCartID();
        console.log("Cart_ID = " + cart_ID);
        if(cart_ID == -1){
          createNewOrder(cart);
        }
        const requestOptions = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
          },
            body: JSON.stringify({ 
            order_ID : cart_ID,
            item_ID : getID(item),
            item_Quantity: quantityType,
            item_Name: getName(item)
          })
        };
        const response = await fetch('/api/driver/post_add_items_to_order', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to add items to database');
        }
    
        // Response from the server after adding items to the database
        const result = await response.json();
      }catch (error) {
        console.error('Error adding items to database:', error);
      }
     
      
    }
    else{
    try {
      createNewOrder(cart);
      const requestOptions = {
          method: "POST",
          headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({ 
          order_ID : order_ID,
          item_ID : getID(item),
          item_Quantity: quantityType,
          item_Name: getName(item)
        })
      };

      const response = await fetch('/api/driver/post_add_items_to_order', requestOptions);
      
      const points = (-Math.round(getPoints(item))* 10 * quantityType);
      if(points > driverPoints){
        throw new Error('Not Enough Points!');
      }
      else{
        console.log(points);
  
        const pointOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            user_ID : user.sub,
            point_change_value : points,
            reason: "order", 
            org_ID: orgID,
            timestamp: "04/02/2024"
          })
        };
          const pointchange = await fetch('/api/sponsor/edit_points', pointOptions);
    
          if (!response.ok) {
            throw new Error('Failed to add items to database');
          }
      
          // Response from the server after adding items to the database
          const result = await response.json();
   
  
      }
     
  
    } catch (error) {
      console.error('Error adding items to database:', error);
    }
    }
  

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
        <div>Points: {Math.round(song.trackPrice) * 10}</div>
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
      <div>Points: {Math.round(album.collectionPrice)*10}</div>
    </div>
  );
  
  const PodcastItem = ({ podcast }) => (
    <div>
      <div>Type: Podcast</div>
      <img src={podcast.artworkUrl100} alt="Podcast Artwork" style={{ width: 100, height: 100 }} />
      <div>Podcast: {podcast.collectionName}</div>
      <div>Artist: {podcast.artistName}</div>
      <div>Genre: {podcast.primaryGenreName}</div>
      <div>Points: {Math.round(podcast.trackPrice)*10}</div>
    </div>
  );
  
  const AudiobookItem = ({ audiobook }) => (
    <div>
      <div>Type: Audiobook</div>
      <img src={audiobook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {audiobook.collectionName}</div>
      <div>Author: {audiobook.artistName}</div>
      <div>Genre: {audiobook.primaryGenreName}</div>
      <div>Points: {Math.round(audiobook.collectionPrice)*10}</div>
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
      <div>Points: {Math.round(movie.trackPrice)*10}</div>
    </div>
  );
  const EbookItem = ({ ebook }) => (
    <div>
      <div>Type: Ebook</div>
      <img src={ebook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {ebook.trackName}</div>
      <div>Author: {ebook.artistName}</div>
      <div>Points: {Math.round(ebook.price)*10}</div>
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
      console.log(entry);
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
                        <button onClick={() => order_item(entry.item_ID,false)} style = {button_style}>Order</button>
                        <button onClick={() => order_item(entry.item_ID,true)} style = {button_style}>Add to Cart</button>
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
