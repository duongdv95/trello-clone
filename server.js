const express               = require("express"),
    bodyParser              = require("body-parser"),
    app                     = express(),
    store                   = require("./store");


// APP CONFIG 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/trello", async (req, res) => {
    const listsArray = await store.getLists();
    console.log(listsArray);
    res.render("trello", {listsArray});
})

app.post("/trello", (req, res) => {
    const listTitle = req.body.listTitle;
    store.createList(listTitle);
    res.sendStatus(200);
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});

