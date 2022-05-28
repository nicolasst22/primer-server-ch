const express = require("express");
const messageController = require("../../controllers/MessageController");
const api = express.Router();
api.get("/", messageController.getMessages);
api.get("/:id", messageController.getMessageById);
api.post("/", messageController.saveMessage);
module.exports = api;