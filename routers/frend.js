const express = require('express')
const frendRouter=express.Router()
const sqlConfig=require('../common/sqlConfig')
let mysql = require("mysql");
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'








module.exports=frendRouter