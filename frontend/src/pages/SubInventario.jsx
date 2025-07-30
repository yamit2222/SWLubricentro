import React, { useEffect, useState } from "react";
import "../styles/inventario.css";
import { getSubProductos } from "../services/subproducto.service";

const SubInventario = () => {
  const [subproductos, setSubProductos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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

  // Categorías según el modelo
  const categorias = [
    "repuestos",
    "limpieza",
    "accesorios externos",
    "accesorios eléctricos"
  ];

  // Agrupar subproductos por categoría
  const subproductosPorCategoria = categorias.map(cat => ({
    nombre: cat.charAt(0).toUpperCase() + cat.slice(1),
    items: subproductos.filter(p => p.categoria === cat)
  }));

  return (
    <div className="inventario-multi">
      {subproductosPorCategoria.map((catObj, idx) => (
        <div className="inventario-card" key={catObj.nombre} style={{ minWidth: 320, boxShadow: "0 2px 12px #0002", borderRadius: 16, padding: 20, background: "#fff", flex: "1 1 340px", marginBottom: 24 }}>
          <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 12, letterSpacing: 1 }}>{catObj.nombre}</div>
          <select
            style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: 8, border: "1px solid #ccc" }}
            value={expandedId || ""}
            onChange={e => setExpandedId(e.target.value)}
          >
            <option value="">Selecciona un subproducto...</option>
            {catObj.items.map((prod) => (
              <option key={prod.id} value={prod.id}>{prod.nombre} (Stock: {prod.stock})</option>
            ))}
          </select>
          {catObj.items.map((prod) => (
            expandedId === String(prod.id) ? (
              <div key={prod.id} className="inventario-item">
                <button
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#333',
                    borderBottom: '1px solid #FFB800',
                  }}
                  onClick={() => setExpandedId(null)}
                >
                  {prod.nombre} <span style={{ float: 'right', color: '#666', fontWeight: 'normal' }}>Stock: {prod.stock}</span>
                </button>
                <div style={{ padding: '12px', background: '#fafafa', borderRadius: '0 0 8px 8px', borderTop: '1px solid #eee' }}>
                  <p><strong>Marca:</strong> {prod.marca}</p>
                  <p><strong>Descripción:</strong> {prod.descripcion}</p>
                  <p><strong>Precio:</strong> ${prod.precio?.toLocaleString() ?? '0'}</p>
                </div>
              </div>
            ) : null
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubInventario;
