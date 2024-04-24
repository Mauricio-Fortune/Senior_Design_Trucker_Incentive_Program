import { useEffect, useState } from "react";
import { Select, Box, FormControl, MenuItem, InputLabel, Container } from '@mui/material';
import DriversPage from './drivers';
import SponsorsPage from './sponsors';

const AdminPanel = () => {
  const [selectedDriver, setDriver] = useState('');
  const [selectedSponsor, setSponsor] = useState('');

  const [allDrivers, setAllDrivers] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`/api/admin/get_all_drivers`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // console.log(result);
        setAllDrivers(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    const getSponsors = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`/api/admin/get_all_sponsors`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // console.log(result);
        setAllSponsors(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    setIsLoading(true);
    getDrivers();
    getSponsors();
    setIsLoading(false);
  }, []);

  const handleDriverChange = (event) => {
    console.log('driver change: '+ event.target.value);
    console.log(allDrivers);
    setDriver(event.target.value);
    console.log(event.target.value);
  };
  const handleSponsorChange = (event) => {
    setSponsor(event.target.value);
  };


  return (
    <div>
      <h1>Admin Panel</h1>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel>View driver</InputLabel>
          <Select
            value={selectedDriver}
            label="selectedDriver"
            onChange={handleDriverChange}
          >
            {!isLoading && allDrivers.length > 0 ? allDrivers.map((driver) => (
              <MenuItem key={driver.user_ID} value={driver.user_ID}>{driver.first_Name}</MenuItem>
            )) : <MenuItem>No Drivers Available</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel>View sponsor</InputLabel>
          <Select
            value={selectedSponsor}
            label="selectedSponsor"
            onChange={handleSponsorChange}
          >
            {!isLoading && allSponsors.length > 0 ? allSponsors.map((sponsor) => (
              <MenuItem key={sponsor.user_ID} value={sponsor.user_ID}>{sponsor.first_Name}</MenuItem>
            )) : <MenuItem>No Sponsors Available</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      {selectedDriver && (
        <>
          <div style={{ marginBottom: '40px' }}></div>
          <DriversPage isSpoofing={true} driverSpoofID={selectedDriver} />
        </>
      )}

      {selectedSponsor && (
        <>
          <div style={{ marginBottom: '40px' }}></div>
          <SponsorsPage isSpoofing={true} sponsorSpoofID={selectedSponsor} />
        </>
      )}
    </div>
  );
}

export default AdminPanel;