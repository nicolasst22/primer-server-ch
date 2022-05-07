const express = require("express");
const productoController = require("./controllers/ProductoController");
const messageController = require("./controllers/MessageController");
const api = express.Router();
const compression = require("compression");
const { fork } = require("child_process");
api.use(compression());
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
    // const child = fork("./src/utils/random.js", [cant]);
    // child.on("message", val => {
    //     const obj = {
    //         port: req.port,
    //         randoms: val
    //     }
    //     res.json(obj);
    // })

    let a = {};
    for (i = 0; i < cant; i++) {
        let n = Math.floor(Math.random() * (cant - 1)) + 1;
        a[n] = a[n] ? (a[n] + 1) : 1;
    }
    res.json(a);
})
api.get("/saludozip", (req, res) => {
    let saludo = "";
    for (i = 0; i < 100; i++) {
        saludo += "hola";
    }
    res.send(saludo);
})

module.exports = api;