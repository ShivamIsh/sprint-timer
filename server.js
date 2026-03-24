const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes.js")
const app = express();


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));




app.use("/upload", uploadRoutes)

app.get("/", (req, res)=>{
    res.render("test.ejs");
});


app.listen("3000", ()=>{
    console.log("listening on port 3000");
})
