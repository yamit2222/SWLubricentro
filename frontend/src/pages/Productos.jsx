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
  Chip,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getProductos, deleteProducto } from '../services/producto.service';
import Search from '../components/Search';
import ProductoForm from '../components/ProductoForm';
import Swal from 'sweetalert2';
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
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'var(--color-exito)',
            color: 'white',
          },
          '&.MuiChip-colorError': {
            backgroundColor: 'var(--color-error)',
            color: 'white',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: 'var(--color-advertencia)',
            color: 'var(--negro-profundo)',
          },
        },
      },
    },
  },
});

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductos();
      const data = Array.isArray(response.data) ? response.data : [];
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('No se pudieron cargar los productos');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los productos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await deleteProducto(id);
        await loadProductos();
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto'
      });
    }
  };

  const handleSearch = (searchTerm) => {
    if (!Array.isArray(productos)) return;
    
    const filtered = productos.filter(producto =>
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  const getStockColor = (stock) => {
    if (stock <= 5) return 'error';
    if (stock <= 10) return 'warning';
    return 'success';
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
            onClick={loadProductos} 
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
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1">
                Gestión de Productos
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedProducto(null);
                setIsFormOpen(true);
              }}
              size="large"
            >
              Nuevo Producto
            </Button>
          </Box>

          <Search 
            onSearch={handleSearch} 
            placeholder="Buscar por nombre, código o descripción..." 
            sx={{ mb: 3 }}
          />

          <Grid container spacing={3}>
            {!Array.isArray(filteredProductos) || filteredProductos.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No hay productos disponibles
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredProductos.map((producto) => (
                <Grid item xs={12} sm={6} md={4} key={producto.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {producto.nombre}
                      </Typography>                    <Typography color="text.secondary" gutterBottom>
                        Marca: {producto.marca} | Tipo: {producto.tipo}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2, 
                          height: '3em', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {producto.descripcion}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ${producto.precio?.toLocaleString() ?? '0'}
                        </Typography>
                        <Chip 
                          label={`Stock: ${producto.stock ?? 0}`}
                          color={getStockColor(producto.stock)}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="Editar">
                        <IconButton 
                          onClick={() => {
                            setSelectedProducto(producto);
                            setIsFormOpen(true);
                          }}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          onClick={() => handleDelete(producto.id)}
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

        <ProductoForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProducto(null);
          }}
          producto={selectedProducto}
          onSuccess={loadProductos}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Productos;
