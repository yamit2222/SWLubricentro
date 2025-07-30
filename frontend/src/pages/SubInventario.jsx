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

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
    items: subproductos.filter(p => p.categoria === cat).slice(0, 12)
  }));

  return (
    <div className="inventario-multi">
      {subproductosPorCategoria.map((catObj, idx) => (
        <div className="inventario-grid" key={catObj.nombre}>
          <div style={{ gridColumn: "1 / -1", fontWeight: "bold", marginBottom: 8 }}>{catObj.nombre}</div>
          {catObj.items.map((prod, i) => (
            <div key={prod.id || i} className="inventario-item">
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
                  borderBottom: expandedId === prod.id ? '1px solid #FFB800' : '1px solid #eee',
                }}
                onClick={() => handleExpand(prod.id)}
              >
                {prod.nombre} <span style={{ float: 'right', color: '#666', fontWeight: 'normal' }}>Stock: {prod.stock}</span>
              </button>
              {expandedId === prod.id && (
                <div style={{ padding: '12px', background: '#fafafa', borderRadius: '0 0 8px 8px', borderTop: '1px solid #eee' }}>
                  <p><strong>Marca:</strong> {prod.marca}</p>
                  <p><strong>Descripción:</strong> {prod.descripcion}</p>
                  <p><strong>Precio:</strong> ${prod.precio?.toLocaleString() ?? '0'}</p>
                </div>
              )}
            </div>
          ))}
          {Array.from({ length: 12 - catObj.items.length }).map((_, i) => (
            <div key={catObj.nombre + "-vacio-" + i} className="inventario-item" style={{ opacity: 0.3 }}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubInventario;
