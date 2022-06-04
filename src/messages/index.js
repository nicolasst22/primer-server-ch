const config = require("../config")
const MensajesFileDAO = require("./dao/MensajesFileDAO")
const MensajeMongoDAO = require("./dao/MensajesMongoDAO")
const MessageDTO = require("../models/DTO/MessageDTO");


class Mensajes {

    constructor() {
        this.dao = this.getDao();
    }

    getDao = () => {
        if (this.dao)
            return this.dao;

        if (config.CONTAINER == 'Mongo') {
            return new MensajeMongoDAO();
        }
        return new MensajesFileDAO();
    }

    getAll = () => {
        return (async () => {
            const all = await this.dao.getAll();
            return all.map(m => new MessageDTO(m));
            //return all;
        })();
    }

    deleteById = async (id) => {
        await this.dao.deleteById(id);
    }

    deleteAll = async () => {
        await this.dao.deleteAll;
    }

    getById = async (id) => {
        let a = await this.dao.getById(id);
        if (a) {
            return new MessageDTO(a);
        }
        return null;
    }

    save = async (objeto) => {
        await new MessageDTO(this.dao.save(objeto));
    }

}

module.exports = new Mensajes();