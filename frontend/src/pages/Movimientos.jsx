import { useEffect, useState } from 'react';
import { getMovimientos, createMovimiento } from '../services/movimientoStock.service';
import { getProductos } from '../services/producto.service';
import { Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, Paper } from '@mui/material';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ productoId: '', tipo: 'entrada', cantidad: '', observacion: '' });
  const [loading, setLoading] = useState(false);
  const loadMovimientos = async () => {
    setLoading(true);
    try {
      const response = await getMovimientos();
      setMovimientos(Array.isArray(response) ? response : (response.data || []));
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
    const { name, value } = e.target;
    
    if (name === 'cantidad') {
      // Solo permitir números enteros positivos
      const intValue = value.replace(/[^0-9]/g, '');
      setForm({ ...form, [name]: intValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productoId || !form.cantidad) return;
    await createMovimiento({ 
      ...form, 
      cantidad: parseInt(form.cantidad, 10) 
    });
    setForm({ productoId: '', tipo: 'entrada', cantidad: '', observacion: '' });
    loadMovimientos();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center', textAlign: 'center' }}>
          <ListAltRoundedIcon sx={{ fontSize: 40, color: '#FFB800' }} />
          <Typography variant="h4" sx={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1, textAlign: 'center' }}>
            Movimientos de Stock
          </Typography>
        </Box>
        <Paper sx={{ p: 2, mb: 4, bgcolor: '#23272F', color: '#F3F4F6', borderRadius: 3 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', background: '#23272F', color: '#F3F4F6', borderRadius: 8, padding: 8 }}>
            <FormControl sx={{ minWidth: 180, bgcolor: '#2C303A', color: '#F3F4F6', borderRadius: 2 }} size="small">
              <InputLabel sx={{ color: '#FFB800' }}>Producto</InputLabel>
              <Select
                name="productoId"
                value={form.productoId}
                label="Producto"
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
            <TextField 
              name="cantidad" 
              label="Cantidad" 
              type="number" 
              size="small" 
              value={form.cantidad} 
              onChange={handleChange} 
              required 
              inputProps={{ 
                min: 1, 
                step: 1,
                pattern: "[0-9]*" 
              }}
              sx={{ 
                width: 100, 
                bgcolor: '#2C303A', 
                color: '#F3F4F6', 
                borderRadius: 2, 
                input: { color: '#F3F4F6', background: '#2C303A' } 
              }} 
              InputLabelProps={{ sx: { color: '#FFB800' } }} 
              InputProps={{ sx: { color: '#F3F4F6' } }} 
            />
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
        <Paper sx={{ mt: 2, bgcolor: '#23272F', color: '#F3F4F6', borderRadius: 2 }}>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F3F4F6' }}>
              <thead>
                <tr style={{ background: '#353945', color: '#FFB800' }}>
                  <th style={{ padding: 8, textAlign: 'left' }}>Fecha</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Producto</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Tipo</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Cantidad</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Observación</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(movimientos) && movimientos.map((mov) => (
                  <tr key={mov.id} style={{ borderBottom: '1px solid #353945' }}>
                    <td style={{ padding: 8 }}>{new Date(mov.createdAt).toLocaleString()}</td>
                    <td style={{ padding: 8 }}>{mov.Producto?.nombre}</td>
                    <td style={{ padding: 8 }}>{mov.tipo}</td>
                    <td style={{ padding: 8 }}>{mov.cantidad}</td>
                    <td style={{ padding: 8 }}>{mov.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Movimientos;
