import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import fondo from '../assets/imagen/lubricartoon.png';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        py: 6,
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(255, 255, 255, 0.14)',
        zIndex: 1,
      }} />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.29)',
          mt: { md: -30 },
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1, color: '#1A1A1A' }}>
          El Socio
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          Los Ángeles, Chile
        </Typography>
      </Box>
    </Box>
  )
}

export default Home