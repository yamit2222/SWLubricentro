import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import { createPedido, updatePedido } from '../services/pedido.service';
import { getAllProductos } from '../services/producto.service';
import { showSuccessAlert, showErrorAlert } from '../helpers/sweetAlert';

const PedidoForm = ({ pedido, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    comentario: '',
    productoId: '',
    cantidad: 1,
    estado: 'en proceso'
  });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProductos();
    
    if (pedido) {
      setFormData({
        comentario: pedido.comentario || '',
        productoId: pedido.productoId || pedido.Producto?.id || '',
        cantidad: pedido.cantidad || 1,
        estado: pedido.estado || 'en proceso'
      });
    }
  }, [pedido]);

  const loadProductos = async () => {
    try {
      const response = await getAllProductos();
      // Manejar la nueva estructura de respuesta con paginación
      if (response.data && response.data.productos) {
        setProductos(response.data.productos);
      } else if (Array.isArray(response.data)) {
        setProductos(response.data);
      } else if (Array.isArray(response)) {
        setProductos(response);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
      showErrorAlert('Error al cargar productos');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        productoId: parseInt(formData.productoId),
        cantidad: parseInt(formData.cantidad)
      };

      if (pedido) {
        await updatePedido(pedido.id, dataToSend);
        showSuccessAlert('Pedido actualizado exitosamente');
      } else {
        await createPedido(dataToSend);
        showSuccessAlert('Pedido creado exitosamente');
      }

      onSuccess();
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      const errorMessage = error.message === "Stock insuficiente" 
        ? "No hay suficiente stock para este pedido" 
        : (error.message || "No se pudo guardar el pedido");
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedProducto = productos.find(p => p.id === parseInt(formData.productoId));

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comentario"
            value={formData.comentario}
            onChange={(e) => handleChange('comentario', e.target.value)}
            required
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFB800',
                },
                '&:hover fieldset': {
                  borderColor: '#FFB800',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFB800',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFB800',
                '&.Mui-focused': {
                  color: '#FFB800',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={productos}
            getOptionLabel={(option) => `${option.nombre} (Stock: ${option.stock})`}
            value={selectedProducto || null}
            onChange={(event, newValue) => {
              handleChange('productoId', newValue ? newValue.id : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Producto"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFB800',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFB800',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFB800',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFB800',
                    '&.Mui-focused': {
                      color: '#FFB800',
                    },
                  },
                }}
              />
            )}
          />
          {selectedProducto && (
            <Box sx={{ mt: 1, color: '#666', fontSize: '0.875rem' }}>
              <strong>Marca:</strong> {selectedProducto.marca} | <strong>Stock disponible:</strong> {selectedProducto.stock}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={formData.cantidad}
            onChange={(e) => handleChange('cantidad', e.target.value)}
            required
            inputProps={{ min: 1, max: selectedProducto?.stock || 999999 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFB800',
                },
                '&:hover fieldset': {
                  borderColor: '#FFB800',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFB800',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFB800',
                '&.Mui-focused': {
                  color: '#FFB800',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel 
              sx={{ 
                color: '#FFB800',
                '&.Mui-focused': {
                  color: '#FFB800',
                },
              }}
            >
              Estado
            </InputLabel>
            <Select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              label="Estado"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFB800',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFB800',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFB800',
                },
              }}
            >
              <MenuItem value="en proceso">En proceso</MenuItem>
              <MenuItem value="vendido">Vendido</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: '#FFB800',
                color: '#FFB800',
                '&:hover': {
                  borderColor: '#FFB800',
                  backgroundColor: 'rgba(255, 184, 0, 0.1)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#FFB800',
                color: '#23272F',
                '&:hover': {
                  bgcolor: '#E6A600',
                },
                '&:disabled': {
                  bgcolor: '#666',
                },
              }}
            >
              {loading ? 'Guardando...' : pedido ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PedidoForm;