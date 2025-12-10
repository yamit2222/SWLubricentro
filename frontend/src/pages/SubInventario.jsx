import React, { useEffect, useState } from "react";
import "../styles/inventario.css";
import { getAllSubProductos } from "../services/subproducto.service";
import { Box, Typography, Container, Paper } from "@mui/material";
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';

const SubInventario = () => {
  const [subproductos, setSubProductos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubProductos = async () => {
      try {
        const response = await getAllSubProductos();
        // Manejar la nueva estructura de respuesta con paginación
        if (response.data && response.data.subproductos) {
          setSubProductos(response.data.subproductos);
        } else if (Array.isArray(response.data)) {
          setSubProductos(response.data);
        } else if (Array.isArray(response)) {
          setSubProductos(response);
        } else {
          setSubProductos([]);
        }
      } catch (error) {
        setSubProductos([]);
      }
    };
    fetchSubProductos();
  }, []);

  const categorias = [
    "repuestos",
    "limpieza",
    "accesorios externos",
    "accesorios eléctricos"
  ];

  const subproductosFiltrados = subproductos.filter((p) => {
    if (!search.trim()) return true;
    const texto = `${p.nombre} ${p.descripcion} ${p.marca}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  const subproductosPorCategoria = categorias.map(cat => ({
    nombre: cat.charAt(0).toUpperCase() + cat.slice(1),
    items: subproductosFiltrados.filter(p => p.categoria === cat)
  }));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarehouseRoundedIcon sx={{ fontSize: 40, color: '#FFB800' }} />
              <Typography variant="h4" component="h1" sx={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1 }}>
                SubInventario
              </Typography>
            </Box>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar subproducto, marca o descripción..."
              style={{
                width: "100%",
                maxWidth: 400,
                padding: "10px 16px",
                fontSize: 16,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#2C303A",
                color: "#F3F4F6",
                boxShadow: "0 1px 4px #0002",
                outline: "none",
                margin: "0 auto",
                display: "block"
              }}
            />
          </Box>
          <div className="inventario-multi" style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: 0, overflowX: "visible" }}>
            {subproductosPorCategoria.map((catObj) => (
              <div className="inventario-card" key={catObj.nombre} style={{ minWidth: 400, maxWidth: 500, boxShadow: "0 2px 12px #0004", borderRadius: 16, padding: 28, background: "#2C303A", flex: "1 1 500px", marginRight: 24, border: "1px solid #444", height: "100%" }}>
                <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 16, letterSpacing: 1, color: '#F3F4F6' }}>{catObj.nombre}</div>
                <details open>
                  <summary style={{ fontWeight: 600, color: '#FFB800', fontSize: 18, cursor: 'pointer', marginBottom: 12 }}>Ver subproductos</summary>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {catObj.items.length === 0 ? (
                      <li style={{ color: "#888", fontStyle: "italic", padding: "4px 0 4px 12px" }}>Sin subproductos</li>
                    ) : (
                      catObj.items.map((prod) => (
                        <li key={prod.id} style={{ padding: "8px 0 8px 16px", borderRadius: 8, marginBottom: 4, background: "#23272F", boxShadow: "0 1px 4px #0002", display: "flex", justifyContent: "space-between", alignItems: "center", color: '#F3F4F6' }}>
                          <span style={{ fontWeight: 500 }}>{prod.nombre}</span>
                          <span style={{ fontSize: "1em", color: "#B0B3B8" }}>Stock: {prod.stock}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default SubInventario;
