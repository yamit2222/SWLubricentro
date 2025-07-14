import fondo from '../assets/imagen/lubricartoon.png';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f7f7',
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '3.3rem', color: '#222', marginBottom: '1rem' }}>Bienvenido a El Socio</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: 400, margin: '0 auto' }}>
          Los Ángeles, Chile.
        </p>
      </div>
    </div>
  );
}

export default Home