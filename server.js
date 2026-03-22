const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes.js")
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/upload", uploadRoutes)

app.get("/", (req, res)=>{
    res.render("index.ejs");
});


app.listen("3000", ()=>{
    console.log("listening on port 3000");
})
