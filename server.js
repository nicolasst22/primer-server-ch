const express = require("express");
const path = require("path")
const routesAPI = require("./src/routes")
require("dotenv").config()
const PORT = process.env.PORT || 8080
const expressSession = require("express-session")
const cookieParser = require("cookie-parser");
const { Server: HttpServer } = require("http");
const MongoStore = require("connect-mongo")
const passport = require('./src/users/config/passport');
const yargs = require('yargs/yargs')(process.argv.slice(2))
const log4js = require("log4js");
log4js.configure({
    appenders: {
        miLoggerConsole: { type: "console" },
        miLoggerFile: { type: "file", filename: "warn.log" },
        miLoggerFileErrs: { type: "file", filename: "error.log" },
        loggerConsola: { type: "logLevelFilter", appender: "miLoggerConsole", level: "info" },
        loggerWarns: { type: "logLevelFilter", appender: "miLoggerFile", level: "warn" },
        loggerErrs: { type: "logLevelFilter", appender: "miLoggerFileErrs", level: "error" }
    },
    categories: {
        // default: { appenders: ["miLoggerConsole"], level: "trace" },
        // consola: { appenders: ["miLoggerConsole"], level: "debug" },
        // archivo: { appenders: ["miLoggerFile"], level: "warn" },
        // archivo2: { appenders: ["miLoggerFileErrs"], level: "error" },
        // todos: { appenders: ["miLoggerConsole", "miLoggerFile"], level: "error" }
        default: { appenders: ["loggerConsola"], level: "all" },
        custom: { appenders: ["loggerConsola", "loggerWarns", "loggerErrs"], level: "all" }
    }
});
const logger = log4js.getLogger("custom");
// logger.trace("Soy un trace");
// logger.debug("Soy un debug");
// logger.info("Soy un info");
// logger.warn("Soy un warn");
// logger.error("Soy un error");
// logger.fatal("Soy fatale!!!");


const args = yargs
    .default({
        port: process.env.PORT || 8080,
        modo: "FORK",
    }).alias({
        p: 'port',
        m: "modo"
    })
    .argv

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
app.use("/api", (req, res, next) => {
    req.port = args.port;
    next();
})
app.use("/api", routesAPI)

app.use(passport.initialize());
app.use(passport.session());




//middleware que contra si esta logueado
const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
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


app.get("/login", (req, res,) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render("login", { error: req.session.messages ? req.session.messages[0] : undefined })
        req.session.messages = []
    }
})

app.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "login",
    failureMessage: "Invalid username or password"
}))

app.get("/logout", auth, (req, res) => {
    const { username } = req.session;
    req.session.destroy(err => {
        if (err) {
            res.send("Ha ocurrido un error")
        } else {
            req.logout();
            res.render("logout", { username })
        }
    })
})

app.get("/registro", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render("registro", { error: req.session.messages ? req.session.messages[0] : undefined })
        req.session.messages = []
    }
})

app.post("/registro", passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/registro"
}))

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureMessage: "No se ha podido iniciar sesión con Facebook."
    }),
    (req, res) => {
        req.session.username = req.user.nombre
        //estoy dentro... voy a home
        res.redirect('/');
    }
);

// app.post("/", auth, async (req, res) => {
//     try {
//         const obj = await MySqlController.save({ ...req.body });
//         // pushData()
//         res.json(obj);
//     } catch (err) {
//         res.status(500).res({ message: "se produjo un error" })
//     }
// })
const numCPUs = require("os").cpus().length;
app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.path}`);
    next();
})
app.get("/info", (req, res) => {
    const info = {
        args: JSON.stringify(args),
        os: process.platform,
        node: process.version,
        memory: JSON.stringify(process.memoryUsage()),
        cwd: process.cwd(),
        pid: process.pid,
        path: process.execPath,
        cpus: numCPUs,
        port: args.port
    };
    res.render("info", { info })
})

app.use((req, res, next) => {
    const msg = `${req.method}: ${req.path} not found`;
    logger.warn(msg);
    res.status(404).send(msg);
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    logger.error("error", err);
    res.status(err.status || 500);
    res.render('error');
});


if (args.modo.toUpperCase() === "CLUSTER") {
    const cluster = require("cluster");
    if (cluster.isMaster) {
        console.log(`Master con pid ${process.pid}`);
        for (i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, signal) => {
            console.log(`el worker pid ${worker} termino con exit ${code}`);
            cluster.fork();
        })
    } else {
        console.log(`Worker con pid ${process.pid}`);
        http.listen(args.port, err => {
            //console.log(`Server iniciado ${PORT} `)
        })
    }
} else {
    http.listen(args.port, err => {
        console.log(`Server iniciado ${args.port} `)
    })
}






