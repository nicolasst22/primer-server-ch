const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
const PORT = 8080;
const app = express();
const productoController = require("./src/controllers/ProductoController")
  
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: true}));

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api", routesAPI)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.post("/", productoController.newProducto)

const server = app.listen(PORT, () => {
    console.log(`Iniciando el servido en ${server.address().port}`)
})

server.on("error", error => `Error en el servidor ${error}`)
