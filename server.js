const express = require("express");
const path = require("path")
const routes = require("./src/router")
const config = require("./src/config/index");
const expressSession = require("express-session")
const cookieParser = require("cookie-parser");
const { Server: HttpServer } = require("http");
const MongoStore = require("connect-mongo")
const passport = require('./src/users/config/passport');
const logger = require("./src/config/logger");
const args = require("./src/config/yargs")

// const io = new SocketIO(http)

const mongoStoreConfig = {
    mongoUrl: config.MONGO_URI
}

const app = express();
const http = new HttpServer(app);
const MINUTOS = 10;
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(expressSession({
    secret:  config.SECRET || "probando",
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
app.use("/api", (req, res, next) => {
    req.port = args.port;
    next();
})
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

const numCPUs = require("os").cpus().length;
if (args.modo.toUpperCase() === "CLUSTER") {
    const cluster = require("cluster");
    if (cluster.isMaster) {
        logger.info(`Master con pid ${process.pid}`);
        for (i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, signal) => {
            logger.info(`el worker pid ${worker} termino con exit ${code}`);
            cluster.fork();
        })
    } else {
        logger.info(`Worker con pid ${process.pid}`);
        http.listen(args.port, err => {
            //logger.info(`Server iniciado ${PORT} `)
        })
    }
} else {
    http.listen(args.port, err => {
        logger.info(`Server iniciado ${args.port} `)
    })
}
module.exports = app





