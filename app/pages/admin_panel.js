import { useEffect, useState } from "react";
import { Select, Box, FormControl, MenuItem, InputLabel, Container } from '@mui/material';

const admin_panel = () => {
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
        setDriver(event.target.value);
    };
    const handleSponsorChange = (event) => {
        setSponsor(event.target.value);
    };


    return (
        <Container>
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
                          <MenuItem key={driver.id} value={driver.id}>{driver.first_Name}</MenuItem>
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
                          <MenuItem key={sponsor.id} value={sponsor.id}>{sponsor.first_Name}</MenuItem>
                        )) : <MenuItem>No Sponsors Available</MenuItem>}
                    </Select>
                </FormControl>
            </Box>
        </Container>
    );
}

export default admin_panel;