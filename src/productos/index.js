const { development } = require('../config/sqlite')
const knex = require('knex')(development);
const createTable = require("../db/utils/createTable");
const seedProductos = require("../db/utils/insertProductos");
const logger = require("../config/logger");
const config = require("../config/index");
const ProductoKnexDAO = require("./dao/ProductoKnexDAO");
const ProductoFileDAO = require("./dao/ProductoFileDAO");
class Productos {

    constructor() {
        this.dao = this.getDao();
    }

    getDao = () => {
        if(this.dao)
            return this.dao;
            
        if (config.CONTAINER != 'SQL') {
            return new ProductoKnexDAO();
        }
        return new ProductoFileDAO();
    }

    getAll = () => {
        return (async () => {
            const a = await this.dao.getAll();
            return a;
        })();
    }

    deleteById = async (id) => {
        await this.dao.deleteById(id);
    }

    deleteAll = async () => {
        await this.dao.deleteAll();
    }

    getById = async (id) => {
        return (async () => {
            const a = await this.dao.getById(id);
            return a;
        })()
    }

    save = async (objeto) => {
       return await his.dao.save(objeto);
    }
}

module.exports = new Productos();


