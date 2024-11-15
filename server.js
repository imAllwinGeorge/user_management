const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const path = require("path");
const connectDB = require("./db/connectDB");
const nocache = require("nocache");
const session = require("express-session")

app.use(nocache())
app.use(session({
    secret:'noworries',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24  
    }
}))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/user',userRouter)
app.use('/admin',adminRouter)




connectDB();
app.listen(3004,()=>{
    console.log("server is running")
})