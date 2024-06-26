import React, { useState, useEffect } from 'react';
import { Table, 
  TableBody,
   TableCell, 
   TableContainer, 
   TableHead, 
   TableRow, 
   Paper, 
   Typography, 
   Container,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   TextField
  } from '@mui/material';
import { fetchUserAttributes } from '@aws-amplify/auth';

export default function Catalog_Manage({isSpoof = false, spoofId = null}) {
  const [entries, setEntries] = useState([]);
  const [detailedItemData, setDetailedItemData] = useState({});
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState();
  const [pointRatio, setPointRatio] = useState();
  const [pointRatioOpen, setPointRatioOpen] = useState(false);



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



  useEffect(() => {
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

    
    if(orgID != null)
      getPointRatio();
    fetchData(); // Called only on component mount
  }, [orgID]);
  
  useEffect(() => {
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

    const removeItem = async (itemID,orgID) => {
      try {
            const requestOptions = {
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                orgID : orgID,
                itemID : itemID
              })
            };
        
            const response = await fetch('/api/catalog/delete_item', requestOptions);
        
            if (!response.ok) {
              throw new Error('Failed to add items to database');
            }
            alert('Item has been removed from the catalog');
          } catch (error) {
            console.error('Error Deleting items to database:', error);
            
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
        <div>Price: ${song.trackPrice}</div>
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
      <div>Price: ${album.collectionPrice}</div>
    </div>
  );
  
  const PodcastItem = ({ podcast }) => (
    <div>
      <div>Type: Podcast</div>
      <img src={podcast.artworkUrl100} alt="Podcast Artwork" style={{ width: 100, height: 100 }} />
      <div>Podcast: {podcast.collectionName}</div>
      <div>Artist: {podcast.artistName}</div>
      <div>Genre: {podcast.primaryGenreName}</div>
      <div>Price: ${podcast.trackPrice}</div>
    </div>
  );
  
  const AudiobookItem = ({ audiobook }) => (
    <div>
      <div>Type: Audiobook</div>
      <img src={audiobook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {audiobook.collectionName}</div>
      <div>Author: {audiobook.artistName}</div>
      <div>Genre: {audiobook.primaryGenreName}</div>
      <div>Price: ${audiobook.collectionPrice}</div>
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
      <div>Price: ${movie.trackPrice}</div>
    </div>
  );
  const EbookItem = ({ ebook }) => (
    <div>
      <div>Type: Ebook</div>
      <img src={ebook.artworkUrl100} alt="Audiobook Artwork" style={{ width: 100, height: 100 }} />
      <div>Title: {ebook.trackName}</div>
      <div>Author: {ebook.artistName}</div>
      <div>Price: ${ebook.price}</div>
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
    const button_style = {
      fontSize: '18px',
      padding: '10px 20px', 
      minWidth: '100px', 
      minHeight: '40px', 
      cursor: 'pointer',
    }
    const handlePointRatio = () => { 
      setPointRatioOpen(true);
  };
  
  const handleCloseDialog = () => {
    setPointRatioOpen(false);
  };
  
  const handleSubmit = () => {
      console.log(`Changing Point Ratio to ${pointRatio} for Org ${orgID}`);
      const pointOptions = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              org_ID : orgID,
              point_Ratio: pointRatio
            })
          };
            fetch('/api/sponsor/post_change_point_ratio', pointOptions);
  
      // Here, add your logic to update the points backend or state
      handleCloseDialog();
  };



  return (
    <div>
      <Typography variant="h4"  component="div" align = "center">
        Catalog Manager
      </Typography>
      <Container variant="h4"  component="div" align = "center">
        <div>Price to Point Ratio: {pointRatio}</div>
        <div>
          <Button
              color="secondary"
              onClick={() => handlePointRatio()}
              style={{ marginRight: '2px' }}
            >
             Edit
            </Button>
          </div>
          <Dialog open={pointRatioOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Point Ratio</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="ratio"
                            label="ratio"
                            type="number"
                            fullWidth
                            value={pointRatio}
                            onChange={(e) => setPointRatio(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">Submit</Button>
                    </DialogActions>
                </Dialog>
      </Container>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.item_ID}>
                  <TableCell align = "center">
                        {renderEntryComponent(entry.item_ID)}
                        <Button  variant="contained"
                         color="primary"
                          onClick={() => removeItem(entry.item_ID,orgID)} >
                            Remove Item
                          </Button>
                  </TableCell>
            </TableRow>
            ))}
      </TableBody>
        </Table>
      </TableContainer>
    </div>
    
  );
}
