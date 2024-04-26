import { useEffect, useState } from "react";
import { Select, Box, FormControl, MenuItem, InputLabel, Divider, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import DriversPage from './drivers';
import SponsorsPage from './sponsors';
import Account from "./account";

const AdminPanel = () => {
  const [selectedDriver, setDriver] = useState('');
  const [selectedSponsor, setSponsor] = useState('');

  const [allDrivers, setAllDrivers] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [openDriverAccountModal, setOpenDriverAccountModal] = useState(false);
  const [openSponsorAccountModal, setOpenSponsorAccountModal] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openSponsorDialog, setOpenSponsorDialog] = useState(false);

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
    setOpenDriverDialog(true);
  };
  const handleSponsorChange = (event) => {
    setSponsor(event.target.value);
    setOpenSponsorDialog(true);
  };


  const handleDriverAccountClick = () => {
    setOpenDriverDialog(false);
    setOpenDriverAccountModal(true);
  }

  const handleSponsorAccountClick = () => {
    setOpenSponsorDialog(false);
    setOpenSponsorAccountModal(true);
  }

  const handleDriverClose = () => {
    setOpenDriverAccountModal(false);
  };
  const handleSponsorClose = () => {
    setOpenSponsorAccountModal(false);
  };

  const handleDriverDialogClose = () => {
    setOpenDriverDialog(false);
  };

  const handleSponsorDialogClose = () => {
    setOpenSponsorDialog(false);
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
          View Users
        </Typography>
      <Box sx={{ minWidth: 120 }} style={{ marginTop: '5px' }}>
        <FormControl fullWidth>
          <InputLabel>Drivers</InputLabel>
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

      <Box sx={{ minWidth: 120 }} style={{ marginTop: '8px' }}>
        <FormControl fullWidth>
          <InputLabel>Sponsors</InputLabel>
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

      <Dialog open={openDriverAccountModal} onClose={handleDriverClose}>
        <DialogContent>
          <Account isSpoof={true} spoofId={selectedDriver} />
        </DialogContent>
      </Dialog>

      <Dialog open={openSponsorAccountModal} onClose={handleSponsorClose}>
        <DialogContent>
          <Account isSpoof={true} spoofId={selectedSponsor} />
        </DialogContent>
      </Dialog>


      <Dialog open={openDriverDialog} onClose={handleDriverDialogClose}>
        <Button onClick={handleDriverAccountClick}>Update Account</Button>
        <DialogContent>
          <DriversPage isSpoofing={true} driverSpoofID={selectedDriver} />
        </DialogContent>
      </Dialog>

      <Dialog open={openSponsorDialog} onClose={handleSponsorDialogClose}>
      <Button onClick={handleSponsorAccountClick}>Update Account</Button>
        <DialogContent>
          <SponsorsPage isSpoofing={true} sponsorSpoofID={selectedSponsor} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPanel;