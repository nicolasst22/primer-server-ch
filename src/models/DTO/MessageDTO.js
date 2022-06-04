class MessageDTO {

    constructor(message){
        this.id = message.id || message.id
        this.email = message.email || message.author.id;
        this.text = message.text || message.message
        this.fecha  = message.fecha;
        this.author = message.author? message.author.id : message.email 
    }

}

module.exports = MessageDTO;