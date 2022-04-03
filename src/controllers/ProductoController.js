const contenedor = require("./MysqlController")
const faker = require('faker');
faker.locale = "es";

exports.listaProductos = async (req, res) => {
    const productos = await contenedor.getAll();
    res.json(productos)
}

const NOT_FOUND = { error: 'producto no encontrado' };
exports.getProducto = async (req, res) => {
    const result = await contenedor.getById(parseInt(req.params.id));
    if (result) {
        res.json(result);
    } else {
        res.status(404).json(NOT_FOUND)
    }
}

exports.newProducto = async (req, res) => {
    const body = req.body;
    await contenedor.save(body)
    res.json(body)
}

exports.updateProducto = async (req, res) => {
    const body = req.body;
    if (await contenedor.getById(parseInt(req.params.id))) {
        body.id = parseInt(req.params.id)
        await contenedor.save(body)
        res.json(body)
    } else {
        res.status(404).json(NOT_FOUND);
    }
}

exports.deleteProducto = async (req, res) => {
    if (await contenedor.getById(parseInt(req.params.id))) {
        await contenedor.deleteById(parseInt(req.params.id));
        res.json({ mensaje: "Objeto eliminado" });
    } else {
        res.status(404).json(NOT_FOUND)
    };
}


exports.test = async (req, res) => {
    const products = []
  
    for(i=0; i <5; i++){
        const p = {
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            foto: faker.image.image(640, 480, true)
        }
        products.push(p);
    }
    res.json(products)
}

