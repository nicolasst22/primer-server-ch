
const AbstractSql = require("../../dao/AbstractSql")

class ProductoKnexDAO extends AbstractSql {
    constructor(){
       super("productos");
    };
}

module.exports = ProductoKnexDAO;