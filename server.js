const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
require("dotenv").config()
const PORT = process.env.PORT || 8080
const expressSession = require("express-session")
const cookieParser = require("cookie-parser");
const { Server: HttpServer } = require("http");

const MongoStore = require("connect-mongo")

// const io = new SocketIO(http)


const mongoStoreConfig = {
    mongoUrl: process.env.MONGO_URI
}

const app = express();
const http = new HttpServer(app);
const MINUTOS = 10;
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(expressSession({
    secret: process.env.SECRET || "probando",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreConfig),
    cookie: {
        maxAge: 1000 * 60 * MINUTOS
    }
}))

//vistas para todos
app.set("views", path.join(__dirname, "src", "views"))

const hbs = require("express-handlebars");
app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api", routesAPI)

//middleware que contra si esta logueado
const auth = (req, res, next) => {
    const { username } = req.session;
    if (username) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.get("/", auth, (req, res) => {
    if (req.session?.visitas) {
        req.session.visitas = 1;
    } else {
        req.session.visitas++;
    }
    const { username } = req.session;
    res.render("index", { username })
})


app.get("/login", (req, res) => {
    if (req.session?.username) {
        res.redirect('/');
    } else {
        res.render("login")
    }
})

app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.redirect('/login');
    } else {
        req.session.username = username
        res.redirect('/');
    }
})

app.get("/logout", auth, (req, res) => {
    const { username } = req.session;
    req.session.destroy(err => {
        if (err) {
            res.send("Ha ocurrido un error")
        } else {
            res.render("logout", { username })
        }
    })
})


// app.post("/", auth, async (req, res) => {
//     try {
//         const obj = await MySqlController.save({ ...req.body });
//         // pushData()
//         res.json(obj);
//     } catch (err) {
//         res.status(500).res({ message: "se produjo un error" })
//     }
// })

http.listen(PORT, err => {
    console.log(`Server iniciado ${PORT} `)
})




