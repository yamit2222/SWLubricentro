import { useFormik } from "formik";
import * as Yup from "yup";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { vehiculoService } from "../services/vehiculo.service";
import { showSuccessAlert, showErrorAlert } from "../helpers/sweetAlert";

const VehiculoForm = ({ open, onClose, vehiculo, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      Marca: vehiculo?.Marca || "",
      Modelo: vehiculo?.Modelo || "",
      Año: vehiculo?.Año || "",
      Filtro_de_aire: vehiculo?.Filtro_de_aire || "",
      Filtro_de_aceite: vehiculo?.Filtro_de_aceite || "",
      Filtro_de_combustible: vehiculo?.Filtro_de_combustible || "",
      Bateria: vehiculo?.Bateria || "",
      Posicion: vehiculo?.Posicion || "",
    },
    validationSchema: Yup.object({
      Marca: Yup.string()
        .required("La marca es requerida")
        .min(2, "La marca debe tener al menos 2 caracteres")
        .max(50, "La marca no puede tener más de 50 caracteres"),
      Modelo: Yup.string()
        .required("El modelo es requerido")
        .min(2, "El modelo debe tener al menos 2 caracteres")
        .max(50, "El modelo no puede tener más de 50 caracteres"),
      Año: Yup.number()
        .required("El año es requerido")
        .min(1900, "El año no puede ser menor a 1900")
        .max(
          new Date().getFullYear() + 1,
          "El año no puede ser mayor al próximo año"
        ),
      Filtro_de_aire: Yup.string().required("El filtro de aire es requerido"),
      Filtro_de_aceite: Yup.string().required("El filtro de aceite es requerido"),
      Filtro_de_combustible: Yup.string().required(
        "El filtro de combustible es requerido"
      ),
      Bateria: Yup.string(),
      Posicion: Yup.string().required("La posición es requerida"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (vehiculo) {
          response = await vehiculoService.actualizar(vehiculo.id, values);
        } else {
          response = await vehiculoService.crear(values);
        }

        if (response.status === "Success") {
          showSuccessAlert(
            vehiculo ? "¡Actualizado!" : "¡Creado!",
            response.message
          );
          onSuccess();
          onClose();
        } else {
          showErrorAlert("Error", response.message);
        }
      } catch (error) {
        showErrorAlert(
          "Error",
          error.message || "Hubo un error al procesar la solicitud"
        );
      }
    },
    enableReinitialize: true,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
          bgcolor: "var(--color-fondo-secundario)",
          "& .MuiDialogTitle-root": {
            bgcolor: "var(--color-fondo-secundario)",
            color: "var(--color-texto-principal)",
          },
          "& .MuiDialogContent-root": {
            bgcolor: "var(--color-fondo-secundario)",
          },
          "& .MuiDialogActions-root": {
            bgcolor: "var(--color-fondo-secundario)",
          },
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" component="span">
            {vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Marca"
                name="Marca"
                label="Marca"
                value={formik.values.Marca}
                onChange={formik.handleChange}
                error={formik.touched.Marca && Boolean(formik.errors.Marca)}
                helperText={formik.touched.Marca && formik.errors.Marca}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Modelo"
                name="Modelo"
                label="Modelo"
                value={formik.values.Modelo}
                onChange={formik.handleChange}
                error={formik.touched.Modelo && Boolean(formik.errors.Modelo)}
                helperText={formik.touched.Modelo && formik.errors.Modelo}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Año"
                name="Año"
                label="Año"
                type="number"
                value={formik.values.Año}
                onChange={formik.handleChange}
                error={formik.touched.Año && Boolean(formik.errors.Año)}
                helperText={formik.touched.Año && formik.errors.Año}
                variant="outlined"
                margin="normal"
                inputProps={{
                  min: "1900",
                  max: new Date().getFullYear() + 1,
                  step: "1",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Filtro_de_aire"
                name="Filtro_de_aire"
                label="Filtro de aire"
                value={formik.values.Filtro_de_aire}
                onChange={formik.handleChange}
                error={
                  formik.touched.Filtro_de_aire &&
                  Boolean(formik.errors.Filtro_de_aire)
                }
                helperText={
                  formik.touched.Filtro_de_aire && formik.errors.Filtro_de_aire
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Filtro_de_aceite"
                name="Filtro_de_aceite"
                label="Filtro de aceite"
                value={formik.values.Filtro_de_aceite}
                onChange={formik.handleChange}
                error={
                  formik.touched.Filtro_de_aceite &&
                  Boolean(formik.errors.Filtro_de_aceite)
                }
                helperText={
                  formik.touched.Filtro_de_aceite && formik.errors.Filtro_de_aceite
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Filtro_de_combustible"
                name="Filtro_de_combustible"
                label="Filtro de combustible"
                value={formik.values.Filtro_de_combustible}
                onChange={formik.handleChange}
                error={
                  formik.touched.Filtro_de_combustible &&
                  Boolean(formik.errors.Filtro_de_combustible)
                }
                helperText={
                  formik.touched.Filtro_de_combustible &&
                  formik.errors.Filtro_de_combustible
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Bateria"
                name="Bateria"
                label="Batería"
                value={formik.values.Bateria}
                onChange={formik.handleChange}
                error={formik.touched.Bateria && Boolean(formik.errors.Bateria)}
                helperText={formik.touched.Bateria && formik.errors.Bateria}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="Posicion"
                name="Posicion"
                label="Posición"
                value={formik.values.Posicion}
                onChange={formik.handleChange}
                error={formik.touched.Posicion && Boolean(formik.errors.Posicion)}
                helperText={formik.touched.Posicion && formik.errors.Posicion}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={formik.isSubmitting}
          >
            {vehiculo ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VehiculoForm;
