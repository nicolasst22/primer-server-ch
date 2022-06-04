
const Archivo = require("../../dao/Archivo")

class MensajeFileDAO extends Archivo {
    constructor(){
       super("messages");
    };
}

module.exports =  MensajeFileDAO;