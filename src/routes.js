const express = require("express");
const productoController = require("./controllers/ProductoController");
const messageController = require("./controllers/MessageController");
const api = express.Router();
const {fork} = require("child_process");

api.get("/productos", productoController.listaProductos);
api.get("/productos/:id", productoController.getProducto);
api.post("/productos/", productoController.newProducto);
api.put("/productos/:id", productoController.updateProducto);
api.delete("/productos/:id", productoController.deleteProducto);
api.get("/productos-test", productoController.test);
api.get("/messages", messageController.getMessages);
api.post("/messages", messageController.saveMessage);
api.get("/randoms", (req, res) => {
    let cant = req.query.cant || 1e7;
    const child = fork("./src/utils/random.js", [cant]);
    child.on("message", val => {
        const obj = {
            port: req.port,
            randoms: val
        }
        res.json(obj);
    })
})

module.exports = api;