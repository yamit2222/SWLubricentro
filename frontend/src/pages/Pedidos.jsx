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
  CircularProgress,
  Pagination,
  Stack
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { getPedidos, createPedido, updatePedido, deletePedido } from "../services/pedido.service";
import Search from '../components/Search';
import PedidoForm from '../components/PedidoForm';
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
            backgroundColor: '#10B981', // Verde esmeralda
            color: 'white',
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#EF4444', // Rojo coral
            color: 'white',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: '#F59E0B', // Naranja ámbar
            color: 'white',
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: '#3B82F6', // Azul cielo
            color: 'white',
          },
          '&.MuiChip-colorDefault': {
            backgroundColor: '#6B7280', // Gris pizarra
            color: 'white',
          },
        },
      },
    },
  },
});

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' o 'list'
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const limite = 10;

  useEffect(() => {
    loadPedidos();
  }, [paginaActual]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPedidos(paginaActual, limite);
      
      // Manejar la respuesta dependiendo de la estructura
      const pedidosData = Array.isArray(response.data) ? response.data : (response.data?.pedidos || response);
      
      setPedidos(pedidosData || []);
      setFilteredPedidos(pedidosData || []);
      
      // Si hay datos de paginación, usarlos
      if (response.data?.totalPaginas) {
        setTotalPaginas(response.data.totalPaginas);
        setTotalPedidos(response.data.totalPedidos || 0);
      } else {
        // Si no hay paginación, usar longitud del array
        setTotalPaginas(Math.ceil((pedidosData?.length || 0) / limite));
        setTotalPedidos(pedidosData?.length || 0);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('No se pudieron cargar los pedidos');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los pedidos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!'
      });

      if (result.isConfirmed) {
        await deletePedido(id);
        await loadPedidos(); // Recargar los datos
        Swal.fire(
          'Eliminado!',
          'El pedido ha sido eliminado.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el pedido'
      });
    }
  };

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedPedido(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPedido(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadPedidos();
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredPedidos(pedidos);
      return;
    }
    
    const filtered = pedidos.filter(pedido =>
      pedido.comentario?.toLowerCase().includes(query.toLowerCase()) ||
      pedido.Producto?.nombre?.toLowerCase().includes(query.toLowerCase()) ||
      pedido.estado?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPedidos(filtered);
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'vendido':
      case 'completado':
      case 'entregado':
        return 'success'; // Verde esmeralda
      case 'en proceso':
      case 'procesando':
      case 'preparando':
        return 'info'; // Azul cielo
      case 'pendiente':
      case 'esperando':
      case 'revision':
        return 'warning'; // Naranja ámbar
      case 'cancelado':
      case 'rechazado':
      case 'anulado':
        return 'error'; // Rojo coral
      default:
        return 'default'; // Gris pizarra
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            background: '-webkit-linear-gradient(90deg, #23272f,#353945,#4e4e4e)',
            background: 'linear-gradient(90deg, #23272f,#353945,#4e4e4e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#FFB800' }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '-webkit-linear-gradient(90deg, #23272f,#353945,#4e4e4e)', background: 'linear-gradient(90deg, #23272f,#353945,#4e4e4e)', padding: 0, overflow: 'hidden' }}>
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
                <Typography variant="h4" component="h1" sx={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1 }}>
                  Gestión de Pedidos
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
                  onClick={handleCreate}
                  size="large"
                  sx={{ bgcolor: '#FFB800', color: '#23272F', borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
                >
                  Nuevo Pedido
                </Button>
              </Box>
            </Box>

            <Search 
              onSearch={handleSearch} 
              placeholder="Buscar por comentario, producto o estado..." 
              sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#F3F4F6CC' }}>
                Total de pedidos: {totalPedidos}
              </Typography>
            </Box>

            {filteredPedidos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#F3F4F6CC', mb: 1 }}>
                  No hay pedidos disponibles
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {pedidos.length === 0 
                    ? 'Crea tu primer pedido haciendo clic en "Nuevo Pedido"' 
                    : 'No hay pedidos que coincidan con tu búsqueda'}
                </Typography>
              </Box>
            ) : null}

            {filteredPedidos.length > 0 && viewMode === 'list' ? (
              <Paper sx={{ mt: 2, bgcolor: '#23272F', color: '#F3F4F6', borderRadius: 2 }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F3F4F6' }}>
                    <thead>
                      <tr style={{ background: '#353945', color: '#FFB800' }}>
                        <th style={{ padding: 8, textAlign: 'left' }}>Comentario</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Producto</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Cantidad</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Fecha</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Estado</th>
                        <th style={{ padding: 8, textAlign: 'left' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPedidos.map((pedido) => (
                        <tr key={pedido.id} style={{ borderBottom: '1px solid #353945', cursor: 'pointer' }} onClick={() => handleEdit(pedido)}>
                          <td style={{ padding: 8, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pedido.comentario || 'Sin comentario'}</td>
                          <td style={{ padding: 8 }}>{pedido.Producto?.nombre || 'Producto no encontrado'}</td>
                          <td style={{ padding: 8 }}>{pedido.cantidad}</td>
                          <td style={{ padding: 8 }}>{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : pedido.hora || 'Sin fecha'}</td>
                          <td style={{ padding: 8 }}>
                            <Chip
                              label={pedido.estado || 'en proceso'}
                              color={getEstadoColor(pedido.estado)}
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </td>
                          <td style={{ padding: 8 }}>
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(pedido);
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
                                  handleDelete(pedido.id);
                                }}
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
            ) : null}

            {filteredPedidos.length > 0 && viewMode === 'grid' && (
              // Vista de cuadrícula usando Cards
              <Grid container spacing={3}>
                {filteredPedidos.map((pedido) => (
                  <Grid item xs={12} sm={6} md={4} key={pedido.id}>
                    <Card
                      sx={{
                        bgcolor: '#353945',
                        color: '#F3F4F6',
                        borderRadius: 2,
                        border: '1px solid #4E525A',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(255, 184, 0, 0.2)',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom noWrap sx={{ color: '#FFB800' }}>
                          {pedido.Producto?.nombre || 'Producto no encontrado'}
                        </Typography>
                        <Typography color="#F3F4F6CC" gutterBottom>
                          {pedido.comentario || 'Sin comentario'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#F3F4F6CC' }}>
                            Cantidad: {pedido.cantidad}
                          </Typography>
                          <Chip
                            label={pedido.estado || 'en proceso'}
                            color={getEstadoColor(pedido.estado)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#F3F4F6CC', fontSize: '0.875rem' }}>
                          {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : pedido.hora || 'Sin fecha'}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => handleEdit(pedido)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => handleDelete(pedido.id)}
                            sx={{ color: '#D72638' }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Paginación */}
            {totalPaginas > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPaginas}
                  page={paginaActual}
                  onChange={(event, value) => setPaginaActual(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#F3F4F6CC',
                      borderColor: '#FFB800',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      bgcolor: '#FFB800',
                      color: '#23272F',
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
          
          {/* Modal para crear/editar pedido */}
          <Popup
            open={isFormOpen}
            onClose={handleFormClose}
            title={selectedPedido ? 'Editar Pedido' : 'Crear Pedido'}
          >
            <PedidoForm
              pedido={selectedPedido}
              onSuccess={handleFormSuccess}
              onClose={handleFormClose}
            />
          </Popup>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Pedidos;
