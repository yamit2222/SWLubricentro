import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Box,IconButton,Typography,InputAdornment,Grid} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { createSubProducto, updateSubProducto } from '../services/subproducto.service';
import Swal from 'sweetalert2';



const SubProductoForm = ({ open, onClose, subproducto, onSuccess }) => {  const formik = useFormik({
    initialValues: {
      nombre: subproducto?.nombre ?? '',
      codigosubP: subproducto?.codigosubP ?? '',
      descripcion: subproducto?.descripcion ?? '',
      precio: subproducto?.precio ?? 0,
      stock: subproducto?.stock ?? 0,
      marca: subproducto?.marca ?? '',
      categoria: subproducto?.categoria ?? ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),
      codigosubP: Yup.number()
        .required('El código es requerido')
        .integer('El código debe ser un número entero')
        .positive('El código debe ser positivo')
        .test('len', 'El código debe tener entre 2 y 10 dígitos', val => 
          val && val.toString().length >= 2 && val.toString().length <= 10),
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
        .oneOf(['repuestos', 'limpieza', 'accesorios externos', 'accesorios eléctricos'], 'Selecciona una categoría válida')
        .required('La categoría es requerida'),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        codigosubP: Number(values.codigosubP)
      };
      try {
        if (subproducto) {
          await updateSubProducto(subproducto.id, payload);
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Subproducto actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          await createSubProducto(payload);
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'SubProducto creado correctamente',
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

  return (
    <Dialog 
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
            {subproducto ? 'Editar subProducto' : 'Nuevo subProducto'}
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
                InputProps={{
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
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
                InputProps={{
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="codigosubP"
                name="codigosubP"
                label="CódigosubP"
                type="number"
                value={formik.values.codigosubP}
                onKeyDown={(e) => {
                  if (!/\d/.test(e.key) && 
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
                error={formik.touched.codigosubP && Boolean(formik.errors.codigosubP)}
                helperText={formik.touched.codigosubP && formik.errors.codigosubP}
                variant="outlined"
                margin="normal"
                InputProps={{
                  inputProps: {
                    inputMode: "numeric",
                    pattern: "[0-9]*"
                  },
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
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
                InputProps={{
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
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
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: {
                    step: "0.01",
                    min: "0",
                    inputMode: "decimal"
                  },
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
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
                InputProps={{
                  inputProps: {
                    min: "0",
                    inputMode: "numeric"
                  },
                  sx: {
                    bgcolor: '#2C303A',
                    color: '#F3F4F6',
                    borderRadius: 2
                  }
                }}
                InputLabelProps={{ sx: { color: '#FFB800' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="categoria"
                name="categoria"
                label="Categoría"
                value={formik.values.categoria || ''}
                onChange={formik.handleChange}
                error={formik.touched.categoria && Boolean(formik.errors.categoria)}
                helperText={formik.touched.categoria && formik.errors.categoria}
                variant="outlined"
                margin="normal"
                SelectProps={{ native: true }}
                InputProps={{ sx: { bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 } }}
                InputLabelProps={{ sx: { color: '#FFB800' }, shrink: true }}
              >
                <option value="" style={{ color: '#FFB800', background: '#23272F' }}>Selecciona una categoría</option>
                <option value="repuestos" style={{ color: '#F3F4F6', background: '#23272F' }}>Repuestos</option>
                <option value="limpieza" style={{ color: '#F3F4F6', background: '#23272F' }}>Limpieza</option>
                <option value="accesorios externos" style={{ color: '#F3F4F6', background: '#23272F' }}>Accesorios externos</option>
                <option value="accesorios eléctricos" style={{ color: '#F3F4F6', background: '#23272F' }}>Accesorios eléctricos</option>
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
            sx={{ bgcolor: '#FFB800', color: '#23272F', borderRadius: 2, fontWeight: 700, boxShadow: 2 }}          >
            {subproducto ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubProductoForm;
