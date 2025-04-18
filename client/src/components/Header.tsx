import { AppBar, Toolbar, Box } from '@mui/material';
import mentatLogo from '/mentat.png';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{
        height: '70px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Box 
          component="a" 
          href="https://mentat.ai" 
          target="_blank"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={mentatLogo}
            alt="Mentat logo"
            sx={{
              height: '40px',
              width: 'auto',
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
