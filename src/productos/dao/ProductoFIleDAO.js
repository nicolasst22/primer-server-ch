
const Archivo = require("../../dao/Archivo")

class ProductoFileDAO extends Archivo {
    constructor(){
       super("productos");
    };
}

module.exports = ProductoFileDAO;