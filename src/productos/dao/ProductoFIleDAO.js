
const Archivo = require("../../dao/Archivo")

class ProductoFileDAO extends Archivo {
    constructor(){
       super("productos");
       console.log("creando file");
    };
}

module.exports = ProductoFileDAO;