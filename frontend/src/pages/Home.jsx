import { Container, Box } from '@mui/material';
import fondo from '../assets/imagen/lubricartoon.png';
import StockAlerts from '../components/StockAlerts';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)',
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      paddingTop: '2rem'
    }}>
      <Container maxWidth="lg">
        {/* Alertas de stock */}
        <StockAlerts />
        
        {/* Contenido principal */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh'
        }}>
          <div style={{
            background: 'rgba(35,39,47,0.92)',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto',
            border: '2px solid #FFB800'
          }}>
            <h1 style={{ fontSize: '3.3rem', color: '#FFB800', marginBottom: '1rem', fontWeight: 800, letterSpacing: 1 }}>
              Bienvenido a <br />"El Socio"
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#F3F4F6', maxWidth: 400, margin: '0 auto' }}>
              Los Ángeles, Chile.
            </p>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default Home
