const express = require("express")
const app = express();
const fs = require("fs")




const incomingRequestLogger = (req,res,next)=>{
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    fs.appendFileSync("./log.txt", `${req.method} ${req.url} ${new Date().toISOString() } \n`);
    next();
  }
  module.exports = {
    incomingRequestLogger
  }
  