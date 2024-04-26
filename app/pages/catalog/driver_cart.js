import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { fetchUserAttributes } from '@aws-amplify/auth';

export default function Catalog_Manage({isSpoof = false, spoofId = null}) {
  const [entries, setEntries] = useState([]);
  const [quantityType, setQuantityType] = useState(1);
  const [detailedItemData, setDetailedItemData] = useState({});
  const [driverPoints, setDriverPoints] = useState(0);
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState();
  const [order_ID, setOrderID] = useState();
  const [cart_ID, setCart] = useState(-1);
  const [cartPoints, setCartPoints] = useState(0);
  const [pointRatio, setPointRatio] = useState(0);

 

 
   
  useEffect(() => {
    async function currentAuthenticatedUser() {
      if (isSpoof) {
        setUser({
          sub: spoofId
        })
        console.log("spoof id: ", spoofId);
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
  }, [user]); // Depend on user state
  

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
        console.log(data.totalPoints);
   
        return data.totalPoints; 
      } catch (error) {
        console.error('Failed to fetch item data:', error);
        console.log(user);
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
  if(orgID != null)
  getPointRatio();

    // This now depends on the user state. Once the user is fetched and set, this runs.
    if (user) {
      (async () => {
        const driverPoints = await getDriverPoints();
        if (driverPoints != null) {
          setDriverPoints(driverPoints);
        }
      })();
    }

    const getCartID = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
    
        if (!user) {
          setUser();
          setCart(-1);
          return -1; // Return -1 when user or user.sub is not available
        }
    
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
    



    const fetchData = async () => { // fetches all itemIDs in database
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
  
        const cart_ID = await getCartID();

          const response = await fetch(`/api/driver/get_items_from_cart?order_ID=${cart_ID}`, requestOptions);
  
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

   (async () => {
  const x = await fetchData();
  // You can use x here if fetchData is modified to return a value.
})();
  }, [orgID]);

 
  useEffect(() => {
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

    const addCartPoints =  async (item) => {
      const points = (Math.round(getPoints(item))* pointRatio);
      setCartPoints(cartPoints => cartPoints + points)
  
    };

    const getItemData = async (itemID) => { // gets item data from iTunes
      try {
        
        const response = await fetch(`/api/catalog/get_lookup?item_ID=${itemID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item data: ${response.statusText}`);
        }
        const data = await response.json(); // Parse the JSON from the response
        const point = await addCartPoints(data);
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
  

  const order_cart = async () => {

    if( cartPoints > driverPoints){
      alert('Not Enough Points!');
     
    }else {

      const pointOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_ID : user.sub,
          point_change_value : -cartPoints,
          reason: "cart order", 
          org_ID: orgID,
          timestamp: ""
        })
      };
        const pointchange = await fetch('/api/sponsor/edit_points', pointOptions);

        const cartOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            user_ID : user.sub,
            order_ID: cart_ID
          })
        };
        console.log("THIS IS CART ORDER\nuser_ID: "+ user.sub + "\norder_ID: "+cart_ID);

        const cartchange = await fetch('/api/driver/post_complete_cart', cartOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

        alert("Items have been ordered!");
      
    }
  };

  const removeItem = async (itemID) => {
    try {
          const requestOptions = {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              order_ID : cart_ID,
              item_ID : itemID
            })
          };
          
          const response = await fetch('/api/driver/delete_item_from_cart', requestOptions) 
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
          
          alert("Removed item from your cart!");
      
        } catch (error) {
          console.error('Error Deleting items to database:', error);
          
        }
  };

  const handleLimitTypeChange = (event) => {
    setQuantityType(Number(event.target.value)); // Convert to number if it's ensured to be numeric
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
      <div>Track Count: {album.trackCount}</div>
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
    <Typography variant="h6" gutterBottom component="div" align="center">
        Total Cart Cost: {cartPoints}
    </Typography>
    <Typography variant="h6" gutterBottom component="div" align="center">
         <button onClick={() => order_cart()} style = {button_style}>Order Cart</button>
    </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.item_ID}>
                  <TableCell align = "center">
                        {renderEntryComponent(entry.item_ID)}
                        <button onClick={() => removeItem(entry.item_ID)} style = {button_style}>Remove</button>
                  </TableCell>
            </TableRow>
            ))}
      </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
