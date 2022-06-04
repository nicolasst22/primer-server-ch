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

const args = yargs
    .default({
        port: process.env.PORT || 8080,
    }).alias({
        p: 'port',

    })
    .argv


const app = express();
const http = new HttpServer(app);
app.get("/", (req, res) => {
    res.send(`Servidor atendido por pid ${process.pid}`);
})

if (args._.find(a => a === "CLUSTER")) {
    if (cluster.isMaster) {
        logger.info(`Master con pid ${process.pid}`);
        cluster.fork();
        cluster.on("exit", (worker, code, signal) => {
            logger.info(worker.process.pid);
            logger.info(`el worker pid ${worker} termino con exit ${code}`);
            cluster.fork();
        })
    } else {
        logger.info(`Worker con pid ${process.pid}`);
        http.listen(PORT, err => {
            logger.info(`Server iniciado ${PORT} `)
        })
    }
} else {
    http.listen(PORT, err => {
        logger.info(`Server iniciado como fork ${PORT} `)
    })
}








