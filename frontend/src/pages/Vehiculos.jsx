import { useState, useEffect } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { vehiculoService } from '../services/vehiculo.service';
import Search from '../components/Search';
import VehiculoForm from '../components/VehiculoForm';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../helpers/sweetAlert';
import '@styles/colors.css';

// Crear un tema personalizado con los colores del proyecto
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB800', // --amarillo-potente
      contrastText: '#1A1A1A', // --negro-profundo
    },
    secondary: {
      main: '#1A1A1A', // --negro-profundo
      contrastText: '#FFB800', // --amarillo-potente
    },
    error: {
      main: '#D72638', // --rojo-energia
    },
    background: {
      default: '#D9D9D9', // --acero-claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // --negro-profundo
      secondary: '#4E4E4E', // --gris-mecanico
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: 'var(--amarillo-potente)',
          color: 'var(--negro-profundo)',
          '&:hover': {
            backgroundColor: 'var(--amarillo-potente-30)',
          },
        },
        outlined: {
          borderColor: 'var(--amarillo-potente)',
          color: 'var(--amarillo-potente)',
          '&:hover': {
            borderColor: 'var(--amarillo-potente)',
            backgroundColor: 'var(--amarillo-potente-10)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-fondo-secundario)',
        },
      },
    },
  },
});

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiculoService.obtenerTodos();
      if (response.status === "Success") {
        setVehiculos(response.data);
        setFilteredVehiculos(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('No se pudieron cargar los vehículos');
      showErrorAlert('Error', 'No se pudieron cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = await showConfirmAlert(
        "¿Estás seguro?",
        "Esta acción no se puede deshacer"
      );

      if (confirmed) {
        const response = await vehiculoService.eliminar(id);
        if (response.status === "Success") {
          showSuccessAlert("¡Eliminado!", "El vehículo ha sido eliminado");
          loadVehiculos();
        } else {
          showErrorAlert("Error", response.message);
        }
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      showErrorAlert("Error", "No se pudo eliminar el vehículo");
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = vehiculos.filter((vehiculo) => {
      const searchString = `${vehiculo.Marca} ${vehiculo.Modelo} ${vehiculo.Año}`
        .toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredVehiculos(filtered);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: '12vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: '12vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Button 
            variant="contained" 
            onClick={loadVehiculos}
            sx={{ mt: 2 }}
          >
            Reintentar
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: '12vh', mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1">
                Gestión de Vehículos
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedVehiculo(null);
                setShowPopup(true);
              }}
              size="large"
            >
              Nuevo Vehículo
            </Button>
          </Box>

          <Search 
            onSearch={handleSearch} 
            placeholder="Buscar por marca, modelo o año..." 
            sx={{ mb: 3 }}
          />

          <Grid container spacing={3}>
            {filteredVehiculos.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No hay vehículos disponibles
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredVehiculos.map((vehiculo) => (
                <Grid item xs={12} sm={6} md={4} key={vehiculo.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {vehiculo.Marca} {vehiculo.Modelo}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        Año: {vehiculo.Año}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Filtro de aire:</strong> {vehiculo.Filtro_de_aire}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Filtro de aceite:</strong> {vehiculo.Filtro_de_aceite}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Filtro de combustible:</strong> {vehiculo.Filtro_de_combustible}
                      </Typography>
                      {vehiculo.Bateria && (
                        <Typography variant="body2" gutterBottom>
                          <strong>Batería:</strong> {vehiculo.Bateria}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Posición:</strong> {vehiculo.Posicion}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="Editar">
                        <IconButton 
                          onClick={() => {
                            setSelectedVehiculo(vehiculo);
                            setShowPopup(true);
                          }}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          onClick={() => handleDelete(vehiculo.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Paper>

        <VehiculoForm
          open={showPopup}
          onClose={() => setShowPopup(false)}
          onSubmit={() => {
            setShowPopup(false);
            loadVehiculos();
          }}
          vehiculo={selectedVehiculo}
          onSuccess={loadVehiculos}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Vehiculos;
