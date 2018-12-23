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
    const cardsArray = await store.getCards();
    res.render("trello", {listsArray, cardsArray});
})

app.post("/trello", async (req, res) => {
    const listTitle = req.body.listTitle;
    const [listID] = await store.createList(listTitle);
    res.status(200).send({listID})
})

app.delete("/trello/:id", async (req, res) => {
    const deleteStatus = await store.deleteList(req.body.listID);
    if (deleteStatus) {
        res.status(200).send({deleteStatus});
    } else {
        res.status(404).send({deleteStatus});
    }
})

app.post("/trello/:id", async (req, res) => {
    const cardDescription = req.body.newCardText;
    const listID = req.body.listID;
    const [cardID] = await store.createCard({cardDescription, listID})
    res.status(200).send({cardID})
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});

