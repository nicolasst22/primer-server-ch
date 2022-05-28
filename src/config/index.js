require('dotenv').config();
let admin = 1;
const PORT =  process.env.PORT;
const MONGO_URI =  process.env.MONGO_URI;
const SECRET = process.env.SECRET || "probando";
const CONTAINER = process.env.CONTAINER || "Archivo";
const FACEBOOK_APP_ID=process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET=process.env.FACEBOOK_APP_SECRET
const APP_URL = process.env.APP_URL || "http://localhost:8080" 

module.exports = { 
    PORT, 
    MONGO_URI,
    SECRET,
    CONTAINER,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    APP_URL
 };