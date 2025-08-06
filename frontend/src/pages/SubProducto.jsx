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
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { getSubProductos, deleteSubProducto } from '../services/subproducto.service';
import Search from '../components/Search';
import SubProductoForm from '../components/SubProductoForm';
import Swal from 'sweetalert2';
import '@styles/colors.css';
import Popup from '../components/Popup';


const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB800', 
      contrastText: '#1A1A1A', 
    },
    secondary: {
      main: '#1A1A1A', 
      contrastText: '#FFB800', 
    },
    error: {
      main: '#D72638',
    },
    background: {
      default: '#D9D9D9', 
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4E4E4E', 
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

const SubProductos = () => {
  const [subproductos, setSubProductos] = useState([]);  const [filteredSubProductos, setFilteredSubProductos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedsubProducto, setSelectedsubProducto] = useState(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' o 'list'

  useEffect(() => {
    loadsubProductos();
  }, []);

  const loadsubProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubProductos();
      const data = Array.isArray(response.data) ? response.data : [];
      setSubProductos(data);
      setFilteredSubProductos(data);
    } catch (error) {
      console.error('Error al cargar subproductos:', error);
      setError('No se pudieron cargar los subproductos');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los subproductos'
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
        await deleteSubProducto(id);
        await loadsubProductos();
        Swal.fire(
          '¡Eliminado!',
          'El subproducto ha sido eliminado.',
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
    if (!Array.isArray(subproductos)) return;
      const filtered = subproductos.filter(subproducto =>
      subproducto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subproducto.codigosubP?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      subproducto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubProductos(filtered);
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
          <Typography color="error" variant="h6">{error}</Typography>          <Button 
            variant="contained" 
            onClick={loadsubProductos} 
            sx={{ mt: 2 }}
          >
            Reintentar
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: '12vh', mb: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              bgcolor: '#23272F',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              border: '2px solid #FFB800',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StorageRoundedIcon sx={{ fontSize: 40, color: '#FFB800' }} />
                <Typography variant="h4" component="h1" sx={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1 }}>
                  Gestión de SubProductos
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<ViewModuleIcon />}
                  onClick={() => setViewMode('grid')}
                  sx={{ borderRadius: 2, bgcolor: viewMode === 'grid' ? '#23272F' : undefined, color: viewMode === 'grid' ? '#F3F4F6CC' : '#FFB800', border: viewMode === 'grid' ? '2px solid #FFB800' : undefined }}
                >
                  Cuadrado
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<ViewListIcon />}
                  onClick={() => setViewMode('list')}
                  sx={{ borderRadius: 2, bgcolor: viewMode === 'list' ? '#23272F' : undefined, color: viewMode === 'list' ? '#F3F4F6CC' : '#FFB800', border: viewMode === 'list' ? '2px solid #FFB800' : undefined }}
                >
                  Lista
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedsubProducto(null);
                    setIsFormOpen(true);
                  }}
                  size="large"
                  sx={{ bgcolor: '#FFB800', color: '#23272F', borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
                >
                  Nuevo SubProducto
                </Button>
              </Box>
            </Box>

            <Search 
              onSearch={handleSearch} 
              placeholder="Buscar por nombre, código o descripción..." 
              sx={{ mb: 3 }}
            />          {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {/* Tarjetas como antes */}
                {!Array.isArray(filteredSubProductos) || filteredSubProductos.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay subproductos disponibles
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  filteredSubProductos.map((subproducto) => (
                    <Grid item xs={12} sm={6} md={4} key={subproducto.id}>
                      <Card elevation={2} sx={{ cursor: 'pointer' }} onClick={() => setSelectedsubProducto(subproducto)}>
                        <CardContent>
                          <Typography variant="h6" component="div" gutterBottom noWrap>
                            {subproducto.nombre}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            Categoría: {subproducto.categoria}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              height: '2.5em',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {subproducto.descripcion}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary">
                              ${subproducto.precio?.toLocaleString() ?? '0'}
                            </Typography>
                            <Chip 
                              label={`Stock: ${subproducto.stock ?? 0}`}
                              color={getStockColor(subproducto.stock)}
                              size="small"
                            />
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          <Tooltip title="Editar">
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedsubProducto(subproducto);
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(subproducto.id);
                              }}
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
            ) : (
              <Paper sx={{ mt: 2, bgcolor: '#23272F', color: '#F3F4F6', borderRadius: 2 }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F3F4F6' }}>
                    <thead>
                      <tr style={{ background: '#353945', color: '#FFB800' }}>
                        <th style={{ padding: 8, textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Marca</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Descripción</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Precio</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Stock</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubProductos.map((subproducto) => (
                        <tr key={subproducto.id} style={{ borderBottom: '1px solid #353945' }}>
                          <td style={{ padding: 8 }}>{subproducto.nombre}</td>
                          <td style={{ padding: 8 }}>{subproducto.marca}</td>
                          <td style={{ padding: 8, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subproducto.descripcion}</td>
                          <td style={{ padding: 8 }}>${subproducto.precio?.toLocaleString() ?? '0'}</td>
                          <td style={{ padding: 8 }}>{subproducto.stock ?? 0}</td>
                          <td style={{ padding: 8 }}>
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => {
                                  setSelectedsubProducto(subproducto);
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
                                onClick={() => handleDelete(subproducto.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            )}
          </Paper>        <SubProductoForm
            open={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedsubProducto(null);
            }}
            subproducto={selectedsubProducto}
            onSuccess={loadsubProductos}
          />
          {/* Modal para ver detalles */}
          {selectedsubProducto && (
            <Popup
              open={!!selectedsubProducto}
              onClose={() => setSelectedsubProducto(null)}
              title={selectedsubProducto.nombre}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Categoría: {selectedsubProducto.categoria}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Descripción: {selectedsubProducto.descripcion}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Marca: {selectedsubProducto.marca}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Precio: ${selectedsubProducto.precio?.toLocaleString() ?? '0'}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Stock: {selectedsubProducto.stock ?? 0}</Typography>
                {}
              </Box>
            </Popup>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default SubProductos;
