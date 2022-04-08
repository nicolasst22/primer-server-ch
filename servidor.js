const express = require('express')
require("dotenv").config()
const {Contenedor} = require('./contenedor')
const app = express()

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    res.send({ mensaje: 'Bienvenido al TP de Servidores con Node. por JNS' })
})

app.get('/productos', (req, res) => {
    const productos =  new Contenedor('./productos.txt').getAll()
    res.json(productos)
})

app.get('/productos', (req, res) => {
    const productos =  new Contenedor('./productos.txt').getAll()
    res.json(productos)
})

app.get('/productoRandom', (req, res) => {
    const productos =  new Contenedor('./productos.txt').getAll()
    const idx = Math.floor(Math.random() * productos.length);
    console.log("idx", idx)
    console.log(productos[idx]);
    res.json(productos[idx])
})

