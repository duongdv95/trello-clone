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
    res.render("trello", {listsArray});
})

app.post("/trello", async (req, res) => {
    const listTitle = req.body.listTitle;
    const [listID] = await store.createList(listTitle);
    // res.sendStatus(200);
    res.status(200).send({listID})
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});

