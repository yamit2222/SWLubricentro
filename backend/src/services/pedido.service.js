import { Pedido } from "../entity/pedido.entity.js";
import { Op } from "sequelize";

export const pedidoService = {
  async obtenerPedidosDelDia() {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const mañana = new Date(hoy);
      mañana.setDate(hoy.getDate() + 1);
      const pedidos = await Pedido.findAll({
        where: {
          createdAt: {
            [Op.gte]: hoy,
            [Op.lt]: mañana
          }
        },
        order: [["createdAt", "DESC"]]
      });
      return [pedidos, null];
    } catch (err) {
      return [null, err.message];
    }
  }
};
