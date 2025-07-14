"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import productoRoutes from "./producto.routes.js";
import subproductoRoutes from "./subproducto.routes.js";
import vehiculoRoutes from "./vehiculo.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/productos", productoRoutes)
    .use("/subproductos", subproductoRoutes)
    .use("/vehiculos", vehiculoRoutes);

export default router;