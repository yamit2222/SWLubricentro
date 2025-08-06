import React, { useEffect, useState } from "react";
import { getPedidos, createPedido, updatePedido, deletePedido } from "../services/pedido.service";
import Swal from "sweetalert2";
import SellRoundedIcon from '@mui/icons-material/SellRounded';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ comentario: "", productoId: "", cantidad: 1, estado: "en proceso" });
  const [productos, setProductos] = useState([]);
  const [productoSearch, setProductoSearch] = useState("");
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await getPedidos();
        setPedidos(Array.isArray(response.data) ? response.data : response);
      } catch (err) {
        setError("No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };fetchPedidos();

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
    try {      await createPedido({
        comentario: form.comentario,
        productoId: parseInt(form.productoId),
        cantidad: parseInt(form.cantidad),
        estado: form.estado || 'en proceso' 
      });
      Swal.fire({ icon: "success", title: "Pedido creado", timer: 1200, showConfirmButton: false });
      setIsFormOpen(false);      setForm({ comentario: "", productoId: "", cantidad: 1, estado: "en proceso" });
      const response = await getPedidos();
      setPedidos(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message === "Stock insuficiente" ? "No hay suficiente stock para este pedido" : (err.message || "No se pudo crear el pedido") });
    }  };
  const handleProductoChange = (e) => {
    const nombreSeleccionado = e.target.value;    setProductoSearch(nombreSeleccionado);
    const productoObj = productos.find(p => p.nombre === nombreSeleccionado);    if (productoObj) {
      setForm({ ...form, productoId: productoObj.id });
    } else {
      setForm({ ...form, productoId: "" });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando pedidos...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #23272F 0%, #353945 40%, #4B4F58 70%, #FFB800 100%)', padding: 0, overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '40px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          <SellRoundedIcon sx={{ fontSize: 40, color: '#FFB800' }} />
          <h2 style={{ color: '#FFB800', fontWeight: 800, letterSpacing: 1, margin: 0, textAlign: 'center' }}>Pedidos realizados hoy</h2>
        </div>
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
                  ))}              </datalist>
              {form.productoId && productos.find(p => p.id === form.productoId) && (
                <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                  <strong>Marca:</strong> {productos.find(p => p.id === form.productoId).marca} | <strong>Stock:</strong> {productos.find(p => p.id === form.productoId).stock}
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
          <div style={{ marginTop: 24 }}>
            <div style={{ background: '#23272F', color: '#F3F4F6', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #0002', border: '2px solid #FFB800' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F3F4F6' }}>
                <thead>
                  <tr style={{ background: '#353945', color: '#FFB800' }}>
                    <th style={{ padding: 12, textAlign: 'left' }}>Comentario</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Producto</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Cantidad</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Hora</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Estado</th>
                    <th style={{ padding: 12, textAlign: 'left' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} style={{ borderBottom: '1px solid #353945' }}>
                      <td style={{ padding: 10 }}>{pedido.comentario}</td>
                      <td style={{ padding: 10 }}>{pedido.Producto?.nombre || 'Producto no encontrado'}</td>
                      <td style={{ padding: 10 }}>{pedido.cantidad}</td>
                      <td style={{ padding: 10 }}>{pedido.hora}</td>
                      <td style={{ padding: 10 }}>{pedido.estado || 'en proceso'}</td>
                      <td style={{ padding: 10 }}>
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
                              try {                            await updatePedido(pedido.id, { estado });
                                Swal.fire('Actualizado', 'El estado se actualizó correctamente', 'success');
                                const response = await getPedidos();
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
                              try {                            await deletePedido(pedido.id);
                                Swal.fire('Eliminado', 'El pedido ha sido eliminado', 'success');
                                const response = await getPedidos();
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
