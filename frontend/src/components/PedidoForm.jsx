import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { createPedido, updatePedido } from '../services/pedido.service';
import { getAllProductos } from '../services/producto.service';
import Swal from 'sweetalert2';

const PedidoForm = ({ open, onClose, pedido, onSuccess }) => {
  const [productos, setProductos] = useState([]);

  const formik = useFormik({
    initialValues: {
      comentario: pedido?.comentario || '',
      productoId: pedido?.productoId || pedido?.Producto?.id || '',
      cantidad: pedido?.cantidad || 1,
      estado: pedido?.estado || 'en proceso'
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.comentario || values.comentario.trim() === '') {
        errors.comentario = 'El comentario es requerido';
      }
      
      if (!values.productoId) {
        errors.productoId = 'Debe seleccionar un producto con stock disponible';
      }
      
      if (!values.cantidad || values.cantidad < 1) {
        errors.cantidad = 'La cantidad debe ser mayor a 0';
      }
      
      if (!values.estado) {
        errors.estado = 'Debe seleccionar un estado';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        // Validaciones adicionales antes de enviar
        if (!values.productoId) {
          Swal.fire({
            icon: 'warning',
            title: 'Producto Requerido',
            text: 'Por favor selecciona un producto con stock disponible antes de continuar',
            confirmButtonColor: '#FFB800'
          });
          return;
        }

        if (!values.comentario || values.comentario.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Campo Requerido',
            text: 'El comentario es obligatorio para crear un pedido',
            confirmButtonColor: '#FFB800'
          });
          return;
        }

        const selectedProduct = productos.find(p => p.id === parseInt(values.productoId));
        if (selectedProduct && values.cantidad > selectedProduct.stock) {
          Swal.fire({
            icon: 'warning',
            title: 'Stock Insuficiente',
            text: `Solo hay ${selectedProduct.stock} unidades disponibles de "${selectedProduct.nombre}". Por favor ajusta la cantidad.`,
            confirmButtonColor: '#FFB800'
          });
          return;
        }

        const payload = {
          ...values,
          productoId: parseInt(values.productoId),
          cantidad: parseInt(values.cantidad)
        };

        if (pedido) {
          await updatePedido(pedido.id, payload);
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Pedido actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          await createPedido(payload);
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'Pedido creado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        }
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error completo:', error);
        
        // Manejo detallado de errores
        if (error?.details && typeof error.details === 'object') {
          // Errores de validación por campo
          formik.setErrors(error.details);
          
          // Mostrar el primer error encontrado
          const firstError = Object.values(error.details)[0];
          Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: firstError || 'Por favor corrige los errores en el formulario',
            confirmButtonColor: '#FFB800'
          });
        } else if (error?.message) {
          // Errores con mensaje específico
          let errorMessage = error.message;
          let errorTitle = 'Error';

          // Personalizar mensajes según el tipo de error
          if (error.message.includes('required') || error.message.includes('requerido')) {
            errorTitle = 'Campos Requeridos';
            errorMessage = 'Por favor complete todos los campos obligatorios';
          } else if (error.message.includes('stock') || error.message === "Stock insuficiente") {
            errorTitle = 'Stock Insuficiente';
            errorMessage = "No hay suficiente stock para este pedido";
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorTitle = 'Error de Conexión';
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
          } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
            errorTitle = 'Error de Autenticación';
            errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente';
          }

          Swal.fire({
            icon: 'error',
            title: errorTitle,
            text: errorMessage,
            confirmButtonColor: '#FFB800'
          });
        } else {
          // Error genérico sin información específica
          Swal.fire({
            icon: 'error',
            title: 'Error Inesperado',
            html: `
              <p>Ocurrió un error inesperado al procesar el pedido.</p>
              <p><strong>Posibles causas:</strong></p>
              <ul style="text-align: left; display: inline-block;">
                <li>Campos requeridos faltantes</li>
                <li>Producto sin stock disponible</li>
                <li>Error de conexión con el servidor</li>
              </ul>
              <p>Por favor verifica los datos e intenta nuevamente.</p>
            `,
            confirmButtonColor: '#FFB800'
          });
        }
      }
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (open) {
      loadProductos();
    } else {
      // Limpiar el formulario cuando se cierra el modal (solo para pedidos nuevos)
      if (!pedido) {
        formik.resetForm();
      }
    }
  }, [open, pedido]);

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar productos'
      });
    }
  };

  const selectedProducto = productos.find(p => p.id === parseInt(formik.values.productoId));

  const handleClose = () => {
    // Limpiar campos específicos al cerrar (solo para pedidos nuevos)
    if (!pedido) {
      formik.setFieldValue('comentario', '');
      formik.setFieldValue('productoId', '');
      formik.setFieldValue('cantidad', 1);
      formik.setFieldValue('estado', 'en proceso');
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          bgcolor: '#23272F',
          boxShadow: 4,
          '& .MuiDialogTitle-root': {
            bgcolor: '#23272F',
            color: '#FFB800',
            fontWeight: 800,
            fontSize: '2rem',
            letterSpacing: 1
          },
          '& .MuiDialogContent-root': {
            bgcolor: '#23272F',
            color: '#F3F4F6',
            borderRadius: 2
          },
          '& .MuiDialogActions-root': {
            bgcolor: '#23272F',
            borderTop: '1px solid #444',
            color: '#F3F4F6'
          }
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="span" sx={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1 }}>
            {pedido ? 'Editar Pedido' : 'Nuevo Pedido'}
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#F3F4F6', bgcolor: '#353945', borderRadius: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="comentario"
                name="comentario"
                label="Comentario"
                value={formik.values.comentario}
                onChange={formik.handleChange}
                multiline
                rows={3}
                variant="outlined"
                margin="normal"
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
                error={Boolean(formik.errors.comentario)}
                helperText={formik.errors.comentario || 'Describe el pedido o servicio requerido'}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ width: '100%', minWidth: '400px' }}>
                <Autocomplete
                  fullWidth
                  options={productos.filter(producto => producto.stock > 0)}
                  getOptionLabel={(option) => `${option.nombre} (Stock: ${option.stock})`}
                  value={selectedProducto || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('productoId', newValue ? newValue.id : '');
                  }}
                  noOptionsText="No hay productos con stock disponible"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      id="productoId"
                      name="productoId"
                      label="Buscar Producto"
                      placeholder="Escribe para buscar un producto..."
                      variant="outlined"
                      margin="normal"
                      InputProps={{ 
                        ...params.InputProps,
                        sx: { 
                          bgcolor: '#2C303A', 
                          color: '#F3F4F6', 
                          borderRadius: 2,
                          minHeight: '60px',
                          minWidth: '100%',
                          fontSize: '1.1rem',
                          '& input': {
                            padding: '18px 20px',
                            fontSize: '1.1rem',
                            minWidth: '300px'
                          },
                          '& .MuiInputBase-root': {
                            minHeight: '60px',
                            minWidth: '100%'
                          }
                        } 
                      }}
                      InputLabelProps={{ 
                        sx: { 
                          color: '#FFB800',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          transform: 'translate(20px, 22px) scale(1)',
                          transformOrigin: 'left top',
                          '&.MuiInputLabel-shrink': {
                            transform: 'translate(20px, -10px) scale(0.9)',
                            backgroundColor: '#23272F',
                            padding: '0 8px',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }
                        } 
                      }}
                      error={Boolean(formik.errors.productoId)}
                      helperText={formik.errors.productoId || (productos.filter(p => p.stock > 0).length === 0 ? 'No hay productos con stock disponible' : 'Selecciona un producto de la lista')}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': { 
                      color: '#FFB800',
                      padding: '12px'
                    },
                    '& .MuiAutocomplete-clearIndicator': { 
                      color: '#FFB800',
                      padding: '12px'
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      minHeight: '60px',
                      minWidth: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFB800'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFB800'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFB800'
                      }
                    },
                    '& .MuiAutocomplete-paper': {
                      bgcolor: '#23272F',
                      color: '#F3F4F6'
                    },
                    '& .MuiAutocomplete-listbox': {
                      bgcolor: '#23272F',
                      color: '#F3F4F6',
                      '& .MuiAutocomplete-option': {
                        color: '#F3F4F6',
                        '&:hover': {
                          bgcolor: '#353945'
                        },
                        '&.Mui-focused': {
                          bgcolor: '#353945'
                        }
                      }
                    }
                  }}
                  componentsProps={{
                    paper: {
                      sx: {
                        bgcolor: '#23272F',
                        color: '#F3F4F6',
                        border: '1px solid #FFB800'
                      }
                    }
                  }}
                />
              </Box>
              {selectedProducto && (
                <Box sx={{ mt: 1, color: '#F3F4F6', fontSize: '0.875rem', p: 1, bgcolor: '#353945', borderRadius: 1 }}>
                  <strong>Marca:</strong> {selectedProducto.marca} | <strong>Stock disponible:</strong> {selectedProducto.stock}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="cantidad"
                name="cantidad"
                label="Cantidad"
                type="number"
                value={formik.values.cantidad}
                onChange={(e) => {
                  const cantidad = parseInt(e.target.value);
                  if (selectedProducto && cantidad > selectedProducto.stock) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Stock Insuficiente',
                      text: `Solo hay ${selectedProducto.stock} unidades disponibles de "${selectedProducto.nombre}".`,
                      confirmButtonColor: '#FFB800'
                    });
                    // Establecer la cantidad máxima disponible
                    formik.setFieldValue('cantidad', selectedProducto.stock);
                  } else {
                    formik.handleChange(e);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                margin="normal"
                inputProps={{ 
                  min: 1, 
                  max: selectedProducto?.stock || 999999,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
                error={Boolean(formik.errors.cantidad)}
                helperText={formik.errors.cantidad}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="estado"
                name="estado"
                label="Estado"
                value={formik.values.estado}
                onChange={formik.handleChange}
                variant="outlined"
                margin="normal"
                SelectProps={{ native: true }}
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' }, shrink: true }}
                error={Boolean(formik.errors.estado)}
                helperText={formik.errors.estado}
              >
                <option value="en proceso" style={{ color: '#F3F4F6', background: '#23272F' }}>En proceso</option>
                <option value="vendido" style={{ color: '#F3F4F6', background: '#23272F' }}>Vendido</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, bgcolor: '#23272F', borderTop: '1px solid #444' }}>
          <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ borderColor: '#FFB800', color: '#FFB800', bgcolor: '#353945', borderRadius: 2, fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={formik.isSubmitting}
            sx={{ bgcolor: '#FFB800', color: '#23272F', borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
          >
            {pedido ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>

  );
};

export default PedidoForm;