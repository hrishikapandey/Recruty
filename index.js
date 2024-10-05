const mongoose = require("mongoose");
const bodyParser = require("body-parser")

const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/job");
const {incomingRequestLogger} = require("./middleware/index.js")
const indexRouter = require("./routes/index.js")
const {mongo} = require("mongoose")
const app = express();
app.use(incomingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use("/api/v1", indexRouter);
app.use("/api/v1/user" , userRouter)
app.use("/api/v1/job", jobRouter);

  app.listen(process.env.PORT, () => {
    console.log('Server is running on ');
    mongoose.connect(process.env.MONGOOSE_URI_STRING).then(()=>{

      console.log("DB connected")
    })
  });


 
  