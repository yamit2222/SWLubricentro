import { useEffect, useState } from 'react';
import { getMovimientos, createMovimiento } from '../services/movimientoStock.service';
import { getProductos } from '../services/producto.service';
import { Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ productoId: '', tipo: 'entrada', cantidad: '', observacion: '' });
  const [loading, setLoading] = useState(false);

  const loadMovimientos = async () => {
    setLoading(true);
    try {
      const data = await getMovimientos();
      setMovimientos(data);
    } finally {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    const data = await getProductos();
    setProductos(Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []));
  };

  useEffect(() => {
    loadMovimientos();
    loadProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productoId || !form.cantidad) return;
    await createMovimiento({ ...form, cantidad: Number(form.cantidad) });
    setForm({ productoId: '', tipo: 'entrada', cantidad: '', observacion: '' });
    loadMovimientos();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6 }}>
        <Typography variant="h4" mb={2}>Movimientos de Stock</Typography>
        <Paper sx={{ p: 2, mb: 4, bgcolor: '#23272F', color: '#F3F4F6', borderRadius: 3 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', background: '#23272F', color: '#F3F4F6', borderRadius: 8, padding: 8 }}>
            <FormControl sx={{ minWidth: 180, bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }} size="small">
              <InputLabel sx={{ color: '#FFB800' }}>Producto</InputLabel>
              <Select name="productoId" value={form.productoId} label="Producto" onChange={handleChange} required sx={{ bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }}>
                {productos.map((p) => (
                  <MenuItem key={p.id} value={p.id} sx={{ bgcolor: '#23272F', color: '#F3F4F6' }}>{p.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120, bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }} size="small">
              <InputLabel sx={{ color: '#FFB800' }}>Tipo</InputLabel>
              <Select
                name="tipo"
                value={form.tipo}
                label="Tipo"
                onChange={handleChange}
                required
                sx={{ bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2, '& .MuiSelect-select': { color: '#F3F4F6' } }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#23272F',
                      color: '#F3F4F6',
                    },
                  },
                }}
              >
                <MenuItem value="entrada" sx={{ bgcolor: '#23272F', color: '#F3F4F6' }}>Entrada</MenuItem>
                <MenuItem value="salida" sx={{ bgcolor: '#23272F', color: '#F3F4F6' }}>Salida</MenuItem>
              </Select>
            </FormControl>
            <TextField name="cantidad" label="Cantidad" type="number" size="small" value={form.cantidad} onChange={handleChange} required sx={{ width: 100, bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }} InputLabelProps={{ sx: { color: '#FFB800' } }} />
            <TextField
              name="observacion"
              label="Observación"
              size="small"
              value={form.observacion}
              onChange={handleChange}
              sx={{ width: 200, bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }}
              InputLabelProps={{ sx: { color: '#FFB800' } }}
              InputProps={{ sx: { color: '#F3F4F6' } }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ bgcolor: '#FFB800', color: '#23272F', borderRadius: 2, fontWeight: 700 }}>Registrar</Button>
          </form>
        </Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Observación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell>{new Date(mov.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{mov.Producto?.nombre}</TableCell>
                  <TableCell>{mov.tipo}</TableCell>
                  <TableCell>{mov.cantidad}</TableCell>
                  <TableCell>{mov.observacion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Movimientos;
