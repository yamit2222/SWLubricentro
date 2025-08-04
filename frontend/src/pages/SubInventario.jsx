import React, { useEffect, useState } from "react";
import "../styles/inventario.css";
import { getSubProductos } from "../services/subproducto.service";
import { Box, Typography } from "@mui/material";

const SubInventario = () => {
  const [subproductos, setSubProductos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubProductos = async () => {
      try {
        const response = await getSubProductos();
        setSubProductos(Array.isArray(response.data) ? response.data : response);
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%,rgba(255, 183, 0, 0.82) 100%)', padding: 0, overflow: 'hidden' }}>
      <Box sx={{ mb: 0, mt: 0, p: 2, bgcolor: '#23272F', borderRadius: 2, boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" component="h2" color="#F3F4F6" fontWeight={800} letterSpacing={1}>
          SubInventario
        </Typography>
      </Box>
      <div style={{ height: 24 }} />
      <div style={{ marginBottom: 24 }}>
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
            background: "#23272F",
            color: "#F3F4F6",
            boxShadow: "0 1px 4px #0002",
            outline: "none",
            margin: "0 auto",
            display: "block"
          }}
        />
      </div>
      <div className="inventario-multi" style={{ display: "flex", flexDirection: "row", gap: 8, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 0, justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: 32 }}>
        {subproductosPorCategoria.map((catObj) => (
          <div className="inventario-card" key={catObj.nombre} style={{ minWidth: 320, maxWidth: 340, boxShadow: "0 2px 12px #0004", borderRadius: 16, padding: 20, background: "#2C303A", flex: "0 0 340px", marginRight: 4, border: "1px solid #444", height: "100%" }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 12, letterSpacing: 1, color: '#F3F4F6' }}>{catObj.nombre}</div>
            <details open>
              <summary style={{ fontWeight: 600, color: '#FFB800', fontSize: 16, cursor: 'pointer', marginBottom: 8 }}>Ver subproductos</summary>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {catObj.items.length === 0 ? (
                  <li style={{ color: "#888", fontStyle: "italic", padding: "4px 0 4px 12px" }}>Sin subproductos</li>
                ) : (
                  catObj.items.map((prod) => (
                    <li key={prod.id} style={{ padding: "6px 0 6px 12px", borderRadius: 6, marginBottom: 2, background: "#23272F", boxShadow: "0 1px 4px #0002", display: "flex", justifyContent: "space-between", alignItems: "center", color: '#F3F4F6' }}>
                      <span style={{ fontWeight: 500 }}>{prod.nombre}</span>
                      <span style={{ fontSize: "0.95em", color: "#B0B3B8" }}>Stock: {prod.stock}</span>
                    </li>
                  ))
                )}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubInventario;
