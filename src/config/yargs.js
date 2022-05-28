const yargs = require('yargs/yargs')(process.argv.slice(2))
const config = require("./index");

module.exports = yargs
.default({
    port: config.PORT || 8080,
    modo: "FORK",
}).alias({
    p: 'port',
    m: "modo"
})
.argv;