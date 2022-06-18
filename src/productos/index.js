const { development } = require('../config/sqlite')
const knex = require('knex')(development);
const createTable = require("../db/utils/createTable");
const seedProductos = require("../db/utils/insertProductos");
const logger = require("../config/logger");
const config = require("../config/index");
const ProductoKnexDAO = require("./dao/ProductoKnexDAO");
const ProductoFileDAO = require("./dao/ProductoFileDAO");
const ProductoDTO = require('../models/DTO/ProductoDTO');
class Productos {

    constructor() {
        this.dao = this.getDao();
    }

    getDao = () => {
        if (this.dao)
            return this.dao;

        if (config.CONTAINER != 'SQL') {
            return new ProductoKnexDAO();
        }
        return new ProductoFileDAO();
    }

    getBy = (campo, valor) => {
        return (async () => {
            let products;
            if (campo && valor) {
                products = await this.dao.getBy(campo, valor);

            } else {
                products = await this.dao.getAll();
            }
            return products.map(product => new ProductoDTO(product));
        })();
    }

    getAll = () => {
        return (async () => {
            const products = await this.dao.getAll();
            return products.map(product => new ProductoDTO(product));
        })();
    }

    deleteById = async (id) => {
       const a = await this.dao.deleteById(id);
       return a;
    }

    deleteAll = async () => {
        await this.dao.deleteAll();
    }

    getById = async (id) => {
        return (async () => {
            const product = await this.dao.getById(id);
            return new ProductoDTO(product);
        })()
    }

    save = async (objeto) => {
        const dto = new ProductoDTO(objeto);
        const newProducto = await this.dao.save(dto.getProducto());
        return new ProductoDTO(newProducto);
    }
}

module.exports = new Productos();


