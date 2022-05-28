const api = require("./api")
const express = require("express");
const app = express.Router();
const logger = require("../config/logger");
const passport = require('../users/config/passport');


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
        req.session.email = req.user.email
        //estoy dentro... voy a home
        res.redirect('/');
    }
);
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

app.use("/api", api)

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





module.exports = app;