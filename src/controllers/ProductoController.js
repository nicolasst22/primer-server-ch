const productos = require("../productos");
const faker = require('faker');
faker.locale = "es";
const logger = require("../config/logger")

exports.listaProductos = async (req, res) => {
    const result = await productos.getAll();
    res.json(result)
}

const NOT_FOUND = { error: 'producto no encontrado' };
exports.getProducto = async (req, res) => {
    const result = await productos.getById(parseInt(req.params.id));
    if (result) {
        res.json(result);
    } else {
        res.status(404).json(NOT_FOUND)
    }
}

exports.newProducto = async (req, res) => {
    try {
        const body = req.body;
        const nuevo = await productos.save(body)
        res.json(nuevo)
    } catch (ex) {
        logger.error(ex.message)
        res.status(500).json("Se produjo un error. Revise los logs de error")
    }
}

exports.updateProducto = async (req, res) => {
    const body = req.body;
    if (await productos.getById(parseInt(req.params.id))) {
        try {
            body.id = parseInt(req.params.id)
            await productos.save(body)
            res.json(body)
        } catch (ex) {
            logger.error(ex.message)
            res.status(500).json("Se produjo un error. Revise los logs de error")
        }
    } else {
        res.status(404).json(NOT_FOUND);
    }
}

exports.deleteProducto = async (req, res) => {
    if (await productos.getById(parseInt(req.params.id))) {
        try {
            await productos.deleteById(parseInt(req.params.id));
            res.json({ mensaje: "Objeto eliminado" });
        } catch (ex) {
            logger.error(ex.message)
            res.status(500).json("Se produjo un error. Revise los logs de error")
        }
    } else {
        res.status(404).json(NOT_FOUND)
    };
}


exports.test = async (req, res) => {
    const products = []

    for (i = 0; i < 5; i++) {
        const p = {
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            foto: faker.image.image(640, 480, true)
        }
        products.push(p);
    }
    res.json(products)
}

