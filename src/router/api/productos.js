const express = require("express");
const productoController = require("../../controllers/ProductoController");
const api = express.Router();
api.get("/", productoController.listaProductos);
api.get("/:id", productoController.getProducto);
api.post("/", productoController.newProducto);
api.put("/:id", productoController.updateProducto);
api.delete("/:id", productoController.deleteProducto);
api.get("/test", productoController.test);

module.exports = api;