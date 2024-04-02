import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function Catalog_Manage() {
  const [entries, setEntries] = useState([]);
  const [detailedItemData, setDetailedItemData] = useState({});

 // hardcoded until cognito is fixed
 // 12 is testorg
  const orgID = 12;

  useEffect(() => {
      fetchData() // get item ids
      const fetchItemDetails = async () => { // get data associated with ids and store the json data
        const detailsPromises = entries.map(entry => getItemData(entry.item_ID));
        const detailsResults = await Promise.all(detailsPromises);
    
        
        const detailsObject = detailsResults.reduce((acc, detail, index) => {
          
          const itemID = entries[index].item_ID;
          acc[itemID] = detail;
          return acc;
        }, {});
    
        setDetailedItemData(detailsObject);
      };
    
      if (entries.length > 0) {
        fetchItemDetails();
      }
    }, [entries]);
    
    

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
 const getItemData = async (itemID) => { // gets item data from iTunes
      try {
        const response = await fetch(`https://itunes.apple.com/lookup?id=${itemID}`);
        if (!response.ok) throw new Error('Failed to fetch item data');
        const data = await response.json();
        return data.results[0]; 
      } catch (error) {
        console.error('Failed to fetch item data:', error);
        return null;
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
        
          } catch (error) {
            console.error('Error Deleting items to database:', error);
            
          }
    };

  return (
    <div>
      <Typography variant="h4" gutterBottom component="div" align = "center">
        Catalog Manager
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
         
          <TableBody>

          {entries.map((entry) => (
            <TableRow key={entry.item_ID}>
                  <TableCell align = "center">
                        {renderEntryComponent(entry.item_ID)}
                        <button onClick={() => removeItem(entry.item_ID,orgID)} style = {button_style}>Remove Item</button>
                  </TableCell>
            </TableRow>
            ))}
      </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
