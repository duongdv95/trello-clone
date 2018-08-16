var express               = require("express"),
    app                   = express();


// APP CONFIG 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("home");
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});