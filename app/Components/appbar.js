// AppBar.js
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
// import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { LoginRounded } from '@mui/icons-material';


const pages = ['Home', 'About', 'Drivers', 'Sponsors', 'Admins'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);  // State to track login status
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateToAccount = () => {
    // Redirect to the account page
    router.push('/account');
    handleCloseUserMenu();
  };

  // const handleLogin = () => {
  //   // Redirect to the Cognito login URL
  //   window.location.href = "https://team25officialsignup.auth.us-east-1.amazoncognito.com/login?client_id=100d3kpmsuk6qt752bcqkstbsp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d2gmf4p0ogiu5s.amplifyapp.com%2F";
  // };

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  const handleLogin = () => {
    // Redirect to the Cognito login URL
    //window.location.href = "https://team25officialsignup.auth.us-east-1.amazoncognito.com/login?client_id=100d3kpmsuk6qt752bcqkstbsp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d2gmf4p0ogiu5s.amplifyapp.com%2F";
    // Redirect to the login page
    router.push('/login');
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
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </IconButton> */}

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
            {(isLoggedIn ? pages : ['Home', 'About']).map((page) => (
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
            {isLoggedIn ? (
              <Tooltip title="Open account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
            ) : (
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            )}
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