const config = require("../config")
var { Contenedor } = require("../dao/" + config.CONTAINER);
const contenedor = new Contenedor("messages");

const mensajes = {}


mensajes.getAll = () => {
    return (async () => {
        const a = await contenedor.getAll();
        return a;
    })();
}

mensajes.deleteById = async (id) => {
    await contenedor.deleteById(id);
}

mensajes.deleteAll = async () => {
    await contenedor.deleteAll;
}

mensajes.getById = async (id) => {
    let a = await contenedor.getById(id);
    return a;
}

mensajes.save = async (objeto) => {
    await contenedor.save(objeto);
}

module.exports = mensajes;