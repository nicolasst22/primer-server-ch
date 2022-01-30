const express = require("express");
const productoController = require("./controllers/ProductoController");
const api = express.Router();

//es solo para hacer mi propio parser y jugar con el funcionamiento de requests
// api.use((req, res, next) => {
//     let data = "";
//     req.on('data', function (chunk) { data += chunk })
//     req.on('end', function () {
//         const headers = JSON.stringify(req.headers)
//         if (!req.is('application/json')) {
//             req.body = data;
//         } else {
//             req.body = JSON.parse(data);
//         }
//         next();
//     })

// })

api.get("/productos", productoController.listaProductos);
api.get("/productos/:id", productoController.getProducto);
api.post("/productos/", productoController.newProducto);
api.put("/productos/:id", productoController.updateProducto);
api.delete("/productos/:id", productoController.deleteProducto);

module.exports = api;