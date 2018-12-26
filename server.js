const express               = require("express"),
    bodyParser              = require("body-parser"),
    app                     = express(),
    store                   = require("./store"),
    session                 = require("express-session");


// APP CONFIG 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(session({
    secret: "merp",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: null}
}));

app.use(function(req, res, next) {
    res.locals = {currentUser: req.session.user};
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    next();
})

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/trello", isLoggedIn, async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const listsArray = await store.getLists({userID});
    const cardsArray = await store.getCards();
    res.render("trello", {listsArray, cardsArray});
})

app.post("/trello", async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const listTitle = req.body.listTitle;
    const [listID] = await store.createList({listTitle, userID});
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

app.put("/trello/:listid/:cardid", async (req, res) => {
    const cardID = req.body.cardID;
    const listID = req.body.listID;
    const updatedCard = req.body.updatedCard;
    const position = req.body.position;
    const updateStatus = await store.updateCard({cardID, listID, updatedCard, position})
    res.status(200).send({updateStatus});
    
})

app.post("/trello/:id", async (req, res) => {
    const cardDescription = req.body.newCardText;
    const listID = req.body.listID;
    const [cardID] = await store.createCard({cardDescription, listID})
    res.status(200).send({cardID})
})

app.delete("/trello/:listid/:cardid", async (req, res) => {
    const cardID = req.body.cardID;
    const listID = req.body.listID;
    const deleteStatus = await store.deleteCard({cardID, listID});
    if (deleteStatus) {
        res.status(200).send({deleteStatus});
    } else {
        res.status(404).send({deleteStatus});
    }
})

app.get("/login", async (req, res) => {
    res.render("login")
})

app.get("/logout", function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  })
})

app.get("/register", async (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username.length == 0 || password.length == 0) {
        res.status(404).send()
        console.log("Missing Username/Password")
        return
    }
    const {userFound} = await store.checkDuplicateUsername({username: req.body.username});
    if(!userFound){
        await store.registerUser({username, password})
        res.status(200).send()  
    } else {
        console.log("username taken");
        res.status(404).send()
        return
    }
})

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const status = await store.authenticateUser({username, password})
    if(status.success) {
        req.session.regenerate(function() {
            req.session.user = status.user;
            req.session.success = "You are logged in! You can view secret page now."
            res.setHeader("redirected", "/trello");
            res.status(200).send()
        })
    } else {
        req.session.error = "Authentication failed";
        res.setHeader("redirected", "/login");
        res.status(404).send()
    }
})

function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});

