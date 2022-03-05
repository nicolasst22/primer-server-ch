const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
const PORT = 8080;
const app = express();
const MySqlController = require("./src/controllers/MySqlController")
const { Server: HttpServer } = require("http");
const http = new HttpServer(app);
const io = require("socket.io")(http)
const MessageController = require("./src/controllers/MessageController")

MessageController.init();

// const io = new SocketIO(http)


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


const pushData = async () => {
    const productos = await MySqlController.getAll();
    io.emit("data", productos);
}


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/productos", async (req, res) => {
    const productos = await MySqlController.getAll();
    res.render("productos", { productos })
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


// const server = app.listen(PORT, () => {
//     console.log(`Iniciando el servido en ${server.address().port}`)
// })
// server.on("error", error => `Error en el servidor ${error}`)

io.on("connection", (socket) => {
    console.log("connection");
    MessageController.getMessages().then(r => {
        io.emit("messages", r);
    })
    socket.on("fetch", data => {
        pushData();
    })

    socket.on("new message", data => {
        data.fecha = new Date();
        MessageController.saveMessage(data);
        io.emit("msg", data)
    })

    socket.on("message", data => {
         pushData();
    })

})

const PORTWS = 8080;
http.listen(PORTWS, err => {
    console.log(`WS iniciado ${PORTWS} `)
})




