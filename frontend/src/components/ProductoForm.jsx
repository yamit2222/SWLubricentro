import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  InputAdornment,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { createProducto, updateProducto } from '../services/producto.service';
import Swal from 'sweetalert2';



const ProductoForm = ({ open, onClose, producto, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      nombre: producto?.nombre || '',
      codigoP: producto?.codigoP || '',
      descripcion: producto?.descripcion || '',
      precio: producto?.precio || '',
      stock: producto?.stock ?? 0,
      marca: producto?.marca || '',
      categoria: producto?.categoria || '',
      subcategoria: producto?.subcategoria || ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),
      codigoP: Yup.number()
        .required('El código es requerido')
        .integer('El código debe ser un número entero')
        .positive('El código debe ser positivo')
        .test('len', 'El código debe tener entre 4 y 10 dígitos', val => 
          val && val.toString().length >= 4 && val.toString().length <= 10),
      descripcion: Yup.string()
        .required('La descripción es requerida')
        .max(500, 'La descripción no puede tener más de 500 caracteres'),
      precio: Yup.number()
        .required('El precio es requerido')
        .positive('El precio debe ser positivo')
        .max(9999999, 'El precio es demasiado alto'),
      stock: Yup.number()
        .required('El stock es requerido')
        .integer('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo')
        .max(99999, 'El stock es demasiado alto'),
      categoria: Yup.string()
        .oneOf(['aceite', 'filtro', 'bateria'], 'Selecciona una categoría válida')
        .required('La categoría es requerida'),
      subcategoria: Yup.string()
        .oneOf(['auto', 'camioneta', 'vehiculo comercial', 'motocicleta', 'maquinaria'], 'Selecciona una subcategoría válida')
        .required('La subcategoría es requerida'),
      marca: Yup.string()
        .required('La marca es requerida')
        .min(2, 'La marca debe tener al menos 3 caracteres')
        .max(15, 'La marca no puede tener más de 15 caracteres'),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          codigoP: Number(values.codigoP)
        };
        if (producto) {
          await updateProducto(producto.id, payload);
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Producto actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          await createProducto(payload);
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'Producto creado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        }
        onSuccess();
        onClose();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al procesar la solicitud'
        });
      }
    },
    enableReinitialize: true
  });

  return (    <Dialog 
      open={open} 
      onClose={onClose}
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
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: '#F3F4F6', bgcolor: '#353945', borderRadius: 2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="marca"
                name="marca"
                label="Marca"
                value={formik.values.marca}
                onChange={formik.handleChange}
                error={formik.touched.marca && Boolean(formik.errors.marca)}
                helperText={formik.touched.marca && formik.errors.marca}
                variant="outlined"
                margin="normal"
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
                variant="outlined"
                margin="normal"
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="codigoP"
                name="codigoP"
                label="Código"
                type="number"
                value={formik.values.codigoP}
                onKeyDown={(e) => {
                  if (!/[\d]/.test(e.key) && 
                      e.key !== 'Backspace' && 
                      e.key !== 'Delete' && 
                      e.key !== 'ArrowLeft' && 
                      e.key !== 'ArrowRight' && 
                      e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) || value === '') {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.codigoP && Boolean(formik.errors.codigoP)}
                helperText={formik.touched.codigoP && formik.errors.codigoP}
                variant="outlined"
                margin="normal"
                InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*' }, sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="descripcion"
                name="descripcion"
                label="Descripción"
                multiline
                rows={4}
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
                variant="outlined"
                margin="normal"
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="precio"
                name="precio"
                label="Precio"
                type="number"
                value={formik.values.precio}
                onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value) || value === '') {
                    formik.handleChange(e);
                  }
                }}
                error={formik.touched.precio && Boolean(formik.errors.precio)}
                helperText={formik.touched.precio && formik.errors.precio}
                variant="outlined"
                margin="normal"
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, inputProps: { step: '0.01', min: '0', inputMode: 'decimal' }, sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="stock"
                name="stock"
                label="Stock"
                type="number"
                value={formik.values.stock}
                disabled
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
                variant="outlined"
                margin="normal"
                InputProps={{ inputProps: { min: '0', inputMode: 'numeric' }, sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                id="categoria"
                name="categoria"
                label="Categoría"
                value={formik.values.categoria ? String(formik.values.categoria) : ''}
                onChange={formik.handleChange}
                error={formik.touched.categoria && Boolean(formik.errors.categoria)}
                helperText={formik.touched.categoria && formik.errors.categoria}
                variant="outlined"
                margin="normal"
                SelectProps={{ native: true }}
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800', fontSize: '0.95em', fontWeight: 500 }, shrink: true }}
              >
                <option value="" style={{ color: '#FFB800', background: '#23272F' }}>Selecciona una categoría</option>
                <option value="aceite" style={{ color: '#F3F4F6', background: '#23272F' }}>Aceite</option>
                <option value="filtro" style={{ color: '#F3F4F6', background: '#23272F' }}>Filtro</option>
                <option value="bateria" style={{ color: '#F3F4F6', background: '#23272F' }}>Batería</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="subcategoria"
                name="subcategoria"
                label="Subcategoría"
                value={formik.values.subcategoria || ''}
                onChange={formik.handleChange}
                error={formik.touched.subcategoria && Boolean(formik.errors.subcategoria)}
                helperText={formik.touched.subcategoria && formik.errors.subcategoria}
                variant="outlined"
                margin="normal"
                SelectProps={{ native: true }}
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' }, shrink: true }}
              >
                <option value="" style={{ color: '#FFB800', background: '#23272F' }}>Selecciona una subcategoría</option>
                <option value="auto" style={{ color: '#F3F4F6', background: '#23272F' }}>Auto</option>
                <option value="camioneta" style={{ color: '#F3F4F6', background: '#23272F' }}>Camioneta</option>
                <option value="vehiculo comercial" style={{ color: '#F3F4F6', background: '#23272F' }}>Vehículo comercial</option>
                <option value="motocicleta" style={{ color: '#F3F4F6', background: '#23272F' }}>Motocicleta</option>
                <option value="maquinaria" style={{ color: '#F3F4F6', background: '#23272F' }}>Maquinaria</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, bgcolor: '#23272F', borderTop: '1px solid #444' }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderColor: '#FFB800', color: '#FFB800', bgcolor: '#353945', borderRadius: 2, fontWeight: 700 }}>
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
            {producto ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductoForm;
