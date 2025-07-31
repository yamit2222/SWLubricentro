import React, { useEffect, useState } from "react";
import { getPedidosDelDia, createPedido, updatePedido, deletePedido } from "../services/pedido.service";
import Swal from "sweetalert2";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ comentario: "", producto: "", cantidad: 1 });
  const [productos, setProductos] = useState([]);
  const [productoSearch, setProductoSearch] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await getPedidosDelDia();
        setPedidos(Array.isArray(response.data) ? response.data : response);
      } catch (err) {
        setError("No se pudieron cargar los pedidos del día");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();

    // Cargar productos para el select
    const fetchProductos = async () => {
      try {
        const response = await import("../services/producto.service");
        const productosResp = await response.getProductos();
        setProductos(Array.isArray(productosResp.data) ? productosResp.data : productosResp);
      } catch (err) {
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregar fecha y hora actual al pedido
      const now = new Date();
      const fecha = now.toLocaleDateString();
      const hora = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await createPedido({ ...form, fecha, hora, estado: form.estado || 'en proceso' });
      Swal.fire({ icon: "success", title: "Pedido creado", timer: 1200, showConfirmButton: false });
      setIsFormOpen(false);
      setForm({ comentario: "", producto: "", cantidad: 1 });
      // Recargar pedidos
      const response = await getPedidosDelDia();
      setPedidos(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message === "Stock insuficiente" ? "No hay suficiente stock para este pedido" : (err.message || "No se pudo crear el pedido") });
    }
  };

  // Manejador para seleccionar producto del datalist
  const handleProductoChange = (e) => {
    const nombreSeleccionado = e.target.value;
    setProductoSearch(nombreSeleccionado);
    // Buscar el producto por nombre
    const productoObj = productos.find(p => p.nombre === nombreSeleccionado);
    if (productoObj) {
      setForm({ ...form, producto: productoObj.id }); // Guardar el ID
    } else {
      setForm({ ...form, producto: "" });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando pedidos...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 24 }}>Pedidos realizados hoy</h2>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              background: '#FFB800',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontWeight: 'bold',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #0001',
              marginBottom: 8
            }}
          >
            Nuevo pedido
          </button>
        </div>
        {isFormOpen && (
          <form onSubmit={handleSubmit} style={{ background: '#fff', boxShadow: '0 2px 12px #0002', borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 400 }}>
            <h3 style={{ marginBottom: 16 }}>Crear pedido</h3>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Comentario"
                value={form.comentario}
                onChange={e => setForm({ ...form, comentario: e.target.value })}
                required
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={productoSearch}
                onChange={handleProductoChange}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, marginBottom: 8 }}
                list="productos-list"
                autoFocus
              />
              <datalist id="productos-list">
                {productos
                  .filter(p => p.nombre.toLowerCase().includes(productoSearch.toLowerCase()))
                  .map((p) => (
                    <option key={p.id} value={p.nombre}>{p.nombre} (Stock: {p.stock})</option>
                  ))}
              </datalist>
              {/* Mostrar detalles del producto seleccionado */}
              {form.producto && productos.find(p => p.id === form.producto) && (
                <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                  <strong>Marca:</strong> {productos.find(p => p.id === form.producto).marca} | <strong>Stock:</strong> {productos.find(p => p.id === form.producto).stock}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="number"
                min={1}
                placeholder="Cantidad"
                value={form.cantidad}
                onChange={e => setForm({ ...form, cantidad: e.target.value })}
                required
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 4, display: 'block' }}>Estado</label>
              <select
                value={form.estado || 'en proceso'}
                onChange={e => setForm({ ...form, estado: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
                required
              >
                <option value="en proceso">En proceso</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#FFB800', color: '#1A1A1A', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Guardar</button>
              <button type="button" onClick={() => setIsFormOpen(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        )}
        {pedidos.length === 0 ? (
          <div style={{ color: '#888' }}>No hay pedidos registrados hoy.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 12px #0002', borderRadius: 12, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f7f7fa' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Comentario</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cantidad</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Hora</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{pedido.comentario}</td>
                  <td style={{ padding: '10px' }}>{pedido.producto}</td>
                  <td style={{ padding: '10px' }}>{pedido.cantidad}</td>
                  <td style={{ padding: '10px' }}>{pedido.hora}</td>
                  <td style={{ padding: '10px' }}>{pedido.estado || 'en proceso'}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      style={{ background: '#FFB800', color: '#1A1A1A', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', marginRight: 8, cursor: 'pointer' }}
                      onClick={async () => {
                        const { value: estado } = await Swal.fire({
                          title: 'Editar estado',
                          input: 'select',
                          inputOptions: {
                            'en proceso': 'En proceso',
                            'vendido': 'Vendido'
                          },
                          inputValue: pedido.estado || 'en proceso',
                          showCancelButton: true,
                          confirmButtonText: 'Guardar',
                          cancelButtonText: 'Cancelar'
                        });
                        if (estado) {
                          try {
                            await updatePedido(pedido.id, { estado });
                            Swal.fire('Actualizado', 'El estado se actualizó correctamente', 'success');
                            const response = await getPedidosDelDia();
                            setPedidos(Array.isArray(response.data) ? response.data : response);
                          } catch (err) {
                            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
                          }
                        }
                      }}
                    >Editar</button>
                    <button
                      style={{ background: '#D72638', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: '¿Eliminar pedido?',
                          text: 'Esta acción no se puede deshacer',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#aaa',
                          confirmButtonText: 'Eliminar',
                          cancelButtonText: 'Cancelar'
                        });
                        if (result.isConfirmed) {
                          try {
                            await deletePedido(pedido.id);
                            Swal.fire('Eliminado', 'El pedido ha sido eliminado', 'success');
                            const response = await getPedidosDelDia();
                            setPedidos(Array.isArray(response.data) ? response.data : response);
                          } catch (err) {
                            Swal.fire('Error', 'No se pudo eliminar el pedido', 'error');
                          }
                        }
                      }}
                    >Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
