// AppBar.js
import React from 'react';
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

const pages = ['Home', 'About', 'Drivers', 'Sponsors', 'Admins', 'Login'];
const sections = ['Section1', 'Section2', 'Section3'];
const settings = ['Profile', 'Account', 'Dashboard', 'Login'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    if (path.toLowerCase() === '/login') {
      // Redirect to the external login URL
      window.location.href = "https://team25officialsignup.auth.us-east-1.amazoncognito.com/login?client_id=100d3kpmsuk6qt752bcqkstbsp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d2gmf4p0ogiu5s.amplifyapp.com%2F";
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
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </IconButton>

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
            LOGO
          </Typography>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              marginTop: '48px',
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => handleNavigate(`/${page.toLowerCase()}`)}>
                {page}
              </MenuItem>
            ))}
            {sections.map((section) => (
              <MenuItem key={section} onClick={() => handleNavigate(`/${section.toLowerCase()}`)}>
                {section}
              </MenuItem>
            ))}
          </Menu>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
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
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;