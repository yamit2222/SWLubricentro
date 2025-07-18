import React, { useEffect, useState } from "react";
import "../styles/inventario.css";
import { getProductos } from "../services/producto.service";

const Inventario = () => {
  const [productos, setProductos] = useState([]);

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

  // Filtrar y limitar a 12 productos por categoría
  const aceites = productos.filter((p) => p.categoria === "aceite").slice(0, 12);
  const filtros = productos.filter((p) => p.categoria === "filtro").slice(0, 12);
  const baterias = productos.filter((p) => p.categoria === "bateria").slice(0, 12);

  return (
    <div className="inventario-multi">
      <div className="inventario-grid">
        <div style={{ gridColumn: "1 / -1", fontWeight: "bold", marginBottom: 8 }}>Aceites</div>
        {aceites.map((prod, idx) => (
          <div key={prod.id || idx} className="inventario-item">
            <strong>{prod.nombre}</strong>
            <br />
            <span style={{ fontSize: "0.9em", color: "#666" }}>Stock: {prod.stock}</span>
          </div>
        ))}
        {/* Rellenar los espacios vacíos si hay menos de 12 productos */}
        {Array.from({ length: 12 - aceites.length }).map((_, idx) => (
          <div key={"aceite-vacio-" + idx} className="inventario-item" style={{ opacity: 0.3 }}></div>
        ))}
      </div>
      <div className="inventario-grid">
        <div style={{ gridColumn: "1 / -1", fontWeight: "bold", marginBottom: 8 }}>Filtros</div>
        {filtros.map((prod, idx) => (
          <div key={prod.id || idx} className="inventario-item">
            <strong>{prod.nombre}</strong>
            <br />
            <span style={{ fontSize: "0.9em", color: "#666" }}>Stock: {prod.stock}</span>
          </div>
        ))}
        {Array.from({ length: 12 - filtros.length }).map((_, idx) => (
          <div key={"filtro-vacio-" + idx} className="inventario-item" style={{ opacity: 0.3 }}></div>
        ))}
      </div>
      <div className="inventario-grid">
        <div style={{ gridColumn: "1 / -1", fontWeight: "bold", marginBottom: 8 }}>Baterías</div>
        {baterias.map((prod, idx) => (
          <div key={prod.id || idx} className="inventario-item">
            <strong>{prod.nombre}</strong>
            <br />
            <span style={{ fontSize: "0.9em", color: "#666" }}>Stock: {prod.stock}</span>
          </div>
        ))}
        {Array.from({ length: 12 - baterias.length }).map((_, idx) => (
          <div key={"bateria-vacio-" + idx} className="inventario-item" style={{ opacity: 0.3 }}></div>
        ))}
      </div>
    </div>
  );
};

export default Inventario;
