const mongoose = require('mongoose');
require('dotenv').config();
const { Message } = require("../../models/Message")
const connectionString = process.env.MONGO_URI
const connector = mongoose.connect(connectionString, {})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
const logger = require("../../config/logger");


class MensajesMongoDAO {

    constructor() {
    }
    save = async (objeto) => {
        try {
            const obj = await this.getById(objeto._id || objeto.id);
            if (obj) {
                await Message.updateOne({ "_id": (objeto._id || objeto.id) }, objeto)
            } else {
                const ultimo = await Message.find({}).sort({ id: -1 }).limit(1);
                objeto.id = (ultimo[0]) ? +ultimo[0].id + 1 : 1;
                return await Message.create(objeto);
            }
        } catch (ex) {
            logger.error("error", ex)
        }
    }

    async getById(id) {
        const p = await Message.findById(mongoose.Types.ObjectId(id))
        return p;
    }

    async getAll() {
        const a = await Message.find({});
        return a.map(x => {
            return x._doc;
        });;
    }

    async deleteById(id) {
        return await Message.findByIdAndDelete({ "_id": id });
    }

    async deleteAll() {
        await Message.deleteMany({});
    }
}

module.exports = MensajesMongoDAO;