import React, { useEffect, useState } from "react";
import "../styles/inventario.css";
import { getProductos } from "../services/producto.service";
import { Box, Typography } from "@mui/material";

const CATEGORIAS = [
  { key: "aceite", label: "Aceites" },
  { key: "filtro", label: "Filtros" },
  { key: "bateria", label: "Baterías" },
];

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState({}); // { categoria: { subcategoria: bool } }
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await getProductos();
        setProductos(Array.isArray(response.data) ? response.data : response);
      } catch (error) {
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter((p) => {
    if (!search.trim()) return true;
    const texto = `${p.nombre} ${p.descripcion} ${p.marca} ${p.subcategoria}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  // Obtener subcategorías dinámicamente desde los productos filtrados
  const getSubcategorias = (categoria) => {
    // Filtra productos por categoría y obtiene subcategorías únicas
    const subs = productosFiltrados
      .filter((p) => p.categoria === categoria)
      .map((p) => p.subcategoria)
      .filter((v, i, arr) => v && arr.indexOf(v) === i);
    return subs.length > 0 ? subs : ["Sin subcategoría"];
  };

  // Agrupar productos filtrados por categoria y subcategoria
  const grouped = {};
  CATEGORIAS.forEach(({ key }) => {
    grouped[key] = {};
    getSubcategorias(key).forEach((sub) => {
      grouped[key][sub] = productosFiltrados.filter(
        (p) => p.categoria === key && p.subcategoria === sub
      );
    });
  });

  const toggleSub = (cat, sub) => {
    setOpen((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [sub]: !prev[cat]?.[sub],
      },
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%,rgba(255, 183, 0, 0.82) 100%)', padding: 0, overflow: 'hidden' }}>
      <Box sx={{ mb: 0, mt: 0, p: 2, bgcolor: '#23272F', borderRadius: 2, boxShadow: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" component="h2" color="#F3F4F6" fontWeight={800} letterSpacing={1}>
          Inventario
        </Typography>
      </Box>
      <div style={{ height: 24 }} />
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto, marca, descripción o subcategoría..."
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
      <div className="inventario-multi" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {CATEGORIAS.map(({ key, label }) => (
          <div key={key} className="inventario-card" style={{ minWidth: 320, boxShadow: "0 2px 12px #0004", borderRadius: 16, padding: 20, background: "#2C303A", flex: "1 1 340px", marginBottom: 24, border: "1px solid #444" }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 12, letterSpacing: 1, color: '#F3F4F6' }}>{label}</div>
            {getSubcategorias(key).map((sub) => (
              <div key={sub} style={{ marginBottom: 10, borderBottom: "1px solid #444" }}>
                <button
                  className="subcat-toggle"
                  aria-expanded={!!open[key]?.[sub]}
                  onClick={() => toggleSub(key, sub)}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    fontWeight: "500",
                    fontSize: 16,
                    padding: "8px 0",
                    cursor: "pointer",
                    color: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "color 0.2s"
                  }}
                >
                  <span style={{ flex: 1 }}>{sub.charAt(0).toUpperCase() + sub.slice(1)}</span>
                  <span style={{ transition: "transform 0.2s", transform: open[key]?.[sub] ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▼
                  </span>
                </button>
                {open[key]?.[sub] && (
                  <ul style={{ listStyle: "none", margin: 0, padding: "0 0 8px 0" }}>
                    {grouped[key][sub].length === 0 ? (
                      <li style={{ color: "#888", fontStyle: "italic", padding: "4px 0 4px 12px" }}>Sin productos</li>
                    ) : (
                      grouped[key][sub].map((prod) => (
                        <li key={prod.id} style={{ padding: "6px 0 6px 12px", borderRadius: 6, marginBottom: 2, background: "#23272F", boxShadow: "0 1px 4px #0002", display: "flex", justifyContent: "space-between", alignItems: "center", color: '#F3F4F6' }}>
                          <span style={{ fontWeight: 500 }}>{prod.nombre}</span>
                          <span style={{ fontSize: "0.95em", color: "#B0B3B8" }}>Stock: {prod.stock}</span>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventario;
