const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
const PORT = 8080;
const app = express();
const productoController = require("./src/controllers/ProductoController")


app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

//vistas para todos
app.set("views", path.join(__dirname, "src", "views"))

//SET HBS
const hbs = require("express-handlebars")
app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars");


//SET PUG
// const pug = require("pug");
// app.set("view engine", "pug");

//SET EJS
//app.set("view engine", "ejs")

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api", routesAPI)



const productos = [
    {
        "title": "Escuadra",
        "price": 123.45,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        "id": 1
    },
    {
        "title": "Calculadora",
        "price": 234.56,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        "id": 2
    },
    {
        "title": "Globo Terráqueo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        "id": 3
    }
]


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/productos", (req, res) => {
    res.render("productos", { productos: productos })
})

app.post("/", (req, res) => {
    const id = (productos && productos.length > 0) ? productos.length + 1 : "1"
    productos.push({ ...req.body, id });
    res.redirect('/productos');
})

const server = app.listen(PORT, () => {
    console.log(`Iniciando el servido en ${server.address().port}`)
})

server.on("error", error => `Error en el servidor ${error}`)
