const express = require("express");
const productosAPI = require("./productos")
const mensajesAPI = require("./mensajes")
const api = express.Router();
const compression = require("compression");
const { fork } = require("child_process");
api.use(compression());

api.use("/productos", productosAPI);
api.use("/messages", mensajesAPI);

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