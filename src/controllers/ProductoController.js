const contenedor = require("./ContenedorController")

exports.listaProductos = (req, res) => {
    res.json(contenedor.getAll())
}

const NOT_FOUND = { error: 'producto no encontrado' };
exports.getProducto = (req, res) => {
    const result = contenedor.getById(parseInt(req.params.id));
    if (result) {
        res.json(result);
    } else {
        res.status(404).json(NOT_FOUND)
    }
}

exports.newProducto = (req, res) => {
    const body = req.body;
    contenedor.save(body)
    res.json(body)
}

exports.updateProducto = (req, res) => {
    const body = req.body;
    console.log("contenedor", contenedor);
    if (contenedor.getById(parseInt(req.params.id))) {
        body.id = parseInt(req.params.id)
        contenedor.save(body)
        res.json(body)
    }
    res.status(404).json(NOT_FOUND);
}

exports.deleteProducto = (req, res) => {
    if (contenedor.getById(parseInt(req.params.id))) {
        contenedor.deleteById(parseInt(req.params.id));
        res.json({ mensaje: "Objeto eliminado" });
    }
    res.status(404).json(NOT_FOUND);
}


