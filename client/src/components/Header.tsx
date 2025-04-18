import { AppBar, Toolbar, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import mentatLogo from '/mentat.png';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #eaeaea',
      }}
    >
      <Toolbar>
        <Box
          component="a"
          href="https://mentat.ai"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <img 
            src={mentatLogo} 
            alt="Mentat logo" 
            style={{ 
              height: '40px', 
              marginRight: '12px' 
            }} 
          />
          {!isMobile && (
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                flexGrow: 0,
              }}
            >
              Mentat Template JS
            </Typography>
          )}
        </Box>

        {/* For mobile: center the title if it doesn't fit next to logo */}
        {isMobile && (
          <Typography 
            variant="h6" 
            component="div"
            align="center"
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            Mentat Template JS
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
