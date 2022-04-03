const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
const PORT = 8080;
const app = express();
const MySqlController = require("./src/controllers/MySqlController")
const { Server: HttpServer } = require("http");
const http = new HttpServer(app);

// const io = new SocketIO(http)


app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

//vistas para todos
app.set("views", path.join(__dirname, "src", "views"))

const hbs = require("express-handlebars")
app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api", routesAPI)

app.get("/", (req, res) => {
    res.render("index")
})


app.post("/", async (req, res) => {
    try {
        const obj = await MySqlController.save({ ...req.body });
        pushData()
        res.json(obj);
    } catch (err) {
        res.status(500).res({ message: "se produjo un error" })
    }
})

const PORTWS = 8080;
http.listen(PORTWS, err => {
    console.log(`WS iniciado ${PORTWS} `)
})




