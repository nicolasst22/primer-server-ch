const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//[{"stock":5,"id":2}]
const MessageSchema = new Schema(
    {
        id: Number,
        text: String,
        fecha: Date,
        author: {
            id: String,
            nombre: String,
            apellido: String,
            alias: String,
            edad: Number,
            avatar: String,
        }
        

    }
)

const Message = mongoose.model("messages", MessageSchema);
module.exports = {
   Message
}