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
const numCPUs = require("os").cpus().length;
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
        console.log(`Master con pid ${process.pid}`);
        cluster.fork();
        cluster.on("exit", (worker, code, signal) => {
            console.log(worker.process.pid);
            console.log(`el worker pid ${worker} termino con exit ${code}`);
            cluster.fork();
        })
    } else {
        console.log(`Worker con pid ${process.pid}`);
        http.listen(PORT, err => {
            console.log(`Server iniciado ${PORT} `)
        })
    }
} else {
    http.listen(PORT, err => {
        console.log(`Server iniciado como fork ${PORT} `)
    })
}








