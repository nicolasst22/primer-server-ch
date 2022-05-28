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

module.exports = logger;