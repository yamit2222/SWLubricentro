import React from "react";
import "../styles/inventario.css";

const Inventario = () => {
  const mueble1 = [
    "a1",
    "a2",
    "a3",
    "a4",
    "b1",
    "b2",
    "b3",
    "b4",
    "c1",
    "c2",
    "c3",
    "c4",
  ];
  const mueble2 = [
    "d1",
    "d2",
    "d3",
    "d4",
    "e1",
    "e2",
    "e3",
    "e4",
    "f1",
    "f2",
    "f3",
    "f4",
  ];
  const mueble3 = [
    "g1",
    "g2",
    "g3",
    "g4",
    "h1",
    "h2",
    "h3",
    "h4",
    "i1",
    "i2",
    "i3",
    "i4",
  ];

  return (
    <div className="inventario-multi">
      <div className="inventario-grid">
        {mueble1.map((posicion, idx) => (
          <div key={"inv1-" + idx} className="inventario-item">
            {posicion}
          </div>
        ))}
      </div>
      <div className="inventario-grid">
        {mueble2.map((posicion, idx) => (
          <div key={"inv2-" + idx} className="inventario-item">
            {posicion}
          </div>
        ))}
      </div>
      <div className="inventario-grid">
        {mueble3.map((posicion, idx) => (
          <div key={"inv3-" + idx} className="inventario-item">
            {posicion}
          </div>
        ))}
      </div>
    </div>
  );




  
};

export default Inventario;
