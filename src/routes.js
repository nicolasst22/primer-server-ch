const express = require("express");
const productoController = require("./controllers/ProductoController");
const messageController = require("./controllers/MessageController");
const api = express.Router();

api.get("/productos", productoController.listaProductos);
api.get("/productos/:id", productoController.getProducto);
api.post("/productos/", productoController.newProducto);
api.put("/productos/:id", productoController.updateProducto);
api.delete("/productos/:id", productoController.deleteProducto);
api.get("/productos-test", productoController.test);
api.get("/messages", messageController.getMessages);
api.post("/messages", messageController.saveMessage);

module.exports = api;