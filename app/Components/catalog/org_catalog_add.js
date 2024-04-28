import React, { useState,useEffect } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';


export default function Catalog_add({isSpoof = false, spoofId = null}) {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [limitType, setLimitType] = useState('');
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState();
  const [selectedItems, setSelectedItems] = useState([]);



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




  // Update state with the user's input
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Update state when the user selects a media type
  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };
  const handleLimitTypeChange = (event) => {
    setLimitType(event.target.value);
  };

  const getID = (item) => {
    // Corrected case for ID fields (from trackID to trackId and collectionID to collectionId)
    if (item.kind === "song" || item.kind === "podcast" || item.kind === "feature-movie" || item.kind === "ebook") {
      return item.trackId;
    } else if (item.collectionType === "Album" || item.wrapperType === "audiobook") {
      return item.collectionId;
    } 
    else {
      if(item.trackID != NULL){
        return item.trackID;
      }
      else if (item.collectionID != NULL){
          return item.collectionID;
      }
      return item.artistId;
    }
  };
  
 
  const addToDatabase = async (item) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          orgID : orgID,
          itemID : getID(item)
        })
      };
  
      const response = await fetch(`/api/catalog/post_add_item`, requestOptions);
  
      if (!response.ok) {
        throw new Error('Failed to add items to database');
      }
  
      // Response from the server after adding items to the database
      const result = await response.json();
  
      // Clear selected items after successful addition to the database or notify the user
      setSelectedItems([]);
      alert('Item has been added to your store!');
  
    } catch (error) {
      console.error('Error adding items to database:', error);
      // Handle error (e.g., show user feedback)
    }
  };
  

  // Fetch data using the user's input and selected media type
  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          term: searchTerm,
          entity: mediaType,
          limit: limitType
        })
      };

      const response = await fetch(`/api/catalog/get_search`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();

      if (Array.isArray(result.results)) {
        setEntries(result.results);
      } else {
        console.error('Expected results to be an array but got:', result);
        setEntries([]); // Fallback to an empty array to avoid runtime errors
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setEntries([]); // Fallback to an empty array on error
    }
  };

  
  // Styles
const headerStyle = {
  textAlign: 'center',
  fontSize: '50px', 
  fontWeight: 'bold',
  margin: '20px 0' 
};
const listItemStyle = {
  listStyleType: 'none',
  textAlign: 'center',
  fontSize: '18px',
  margin: '10px 0'
};
const spacerStyle = {
  height: '50px',
};
const searchBarStyle = {
    marginRight: '10px',
    fontSize: '20px',
    padding: '10px',
    width: '300px',
};
const seachButtonStyle = {
    fontSize: '18px',
    padding: '10px 20px', 
    minWidth: '100px', 
    minHeight: '40px', 
    cursor: 'pointer',
}
const database_button_style = {
  fontSize: '18px',
  padding: '10px 20px', 
  minWidth: '100px', 
  minHeight: '40px', 
  cursor: 'pointer',
}
const dropdown_menu_style = {
  marginRight: '10px',
  fontSize: '20px',
  padding: '10px',
  width: '200px',
}


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

function renderEntryComponent(entry) {
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


return (
  <>
    {/* Seach */}
    <div>
      <header style={headerStyle}>Search iTunes</header>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        { }
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search ITunes"
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              fetchData();
            }}}
          style={searchBarStyle}
        />
        {/* Step 2: Dropdown for selecting media type */}
          
          <button onClick={fetchData} style={seachButtonStyle}>Search</button>
        </div>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <select value={mediaType} onChange={handleMediaTypeChange} style={dropdown_menu_style}>
            <option value="media=all">Select</option>
            <option value="entity=song">Songs</option>
            <option value="entity=album">Albums</option>
            <option value="entity=podcast">Podcasts</option>
            <option value="entity=audiobook">Audiobooks</option>
            <option value="entity=movie">Movies</option>
            <option value="entity=ebook">eBooks</option>
          </select>
          <select value={limitType} onChange={handleLimitTypeChange} style={dropdown_menu_style}>
            <option value="">Number of Results</option>
            <option value="limit=1">1</option>
            <option value="limit=5">5</option>
            <option value="limit=10">10</option>
            <option value="limit=20">20</option>
            <option value="limit=50">50</option>
            <option value="limit=100">100</option>
          </select>
        </div>
        <ul style={{padding: 0}}>
          {entries.map((entry, index) => (
          <li key={index} style={listItemStyle}>
            {renderEntryComponent(entry)}
            <button onClick={() => addToDatabase(entry)} style = {database_button_style}>Add To Calalog</button>
            <div style={spacerStyle}></div>
          </li>
          ))}
        </ul>
      </div>
  </>

);
}

