const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const { userDB } = require("./models/User");

const app = express();
const port  = process.env.PORT || 8000;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database connected");
}).catch((e)=>{
    console.log(e);
});


//middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});