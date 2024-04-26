import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';

const pages = ['Home', 'About', 'Dashboard'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);  // State to track login status
  const router = useRouter();

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateToAccount = () => {
    // Redirect to the account page
    router.push('/account');
    handleCloseUserMenu();
  };

  const handleNavigate = (path) => {
    if (path.toLowerCase() === '/login' && !isLoggedIn) {
      // If not logged in, perform login
      handleLogin();
    } else if (path.toLowerCase() === '/home') {
      // Redirect to the home page
      router.push('/');
    } else {
      // For other paths, use router.push
      router.push(path);
    }
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigate('/')}
          >
            DRIVE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {(isLoggedIn ? pages : ['Home', 'About', 'Dashboard']).map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(`/${page.toLowerCase()}`)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
          <Button color="inherit" onClick={handleNavigateToAccount}>
              Account
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleNavigateToAccount}>
                Account
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
