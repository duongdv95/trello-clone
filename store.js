const knexfile                = require("./knexfile.js"),
      knex                    = require("knex")(knexfile),
      crypto                  = require("crypto");
    
async function createList({listTitle, userID}) {
    const listId = await knex("lists").insert({list_name: listTitle, user_id: userID})
    return listId
}

async function getLists({userID}) {
    const listsQuery = await knex("lists").select("list_name", "id").where({user_id: userID})
    const listObjects = listsQuery.map(function(element) {
        return {listName: element.list_name, id: element.id}
    })
    return listObjects;
}

async function getCards() {
    const listsQuery = await knex("cards").select("id", "card", "list_id", "position")
    const listObjects = listsQuery.map(function(element) {
        return {cardDescription: element.card, id: element.id, listID: element.list_id, position: element.position}
    })
    return listObjects;
}

async function deleteList(listID) {
    const deleteStatus = await knex("lists").select("list_name").del().where({id: listID})
    const cardsQuery = await knex("cards").select("id", "list_id").where({list_id: listID})
    const cardObjects = cardsQuery.map(function(element) {
        return {id: element.id, listID: element.list_id}
    })
    cardObjects.forEach(async function(element) {
        await deleteCard({cardID: element.id, listID: element.listID})
    })
    return (deleteStatus == 1) ? true : false
}

async function deleteCard({cardID, listID}) {
    const deleteStatus = await knex("cards").select("card").del().where({id: cardID, list_id: listID})
    return (deleteStatus == 1) ? true : false
}

async function createCard({cardDescription, listID}) {
    const cardID = await knex("cards").insert({card: cardDescription, list_id: listID})
    return cardID
}

async function updateCard({cardID, listID, updatedCard, position}) {
    const updateStatus = await knex("cards").where({id: cardID}).update({card: updatedCard, list_id: listID, position})
    return updateStatus
}

async function checkDuplicateUsername ({username}) {
    const [userData] = await knex("users").select("username").where({username});
    return userData ? {userFound: userData.username} : {userFound: null};
}

async function authenticateUser({username, password}) {
    console.log(`Authenticating user ${username}`);
    const [user] = await knex("users").where({username});
    if(!user) return {success: false, user: null}
    const {hash} = saltHashPassword({
        password, 
        salt: user.salt
        })
    return {success: hash === user.encrypted_password, user: username}
}

async function registerUser({username, password}) {
    console.log(`Add user ${username} with password ${password}`)
    const {salt, hash} = saltHashPassword({password});
    return await knex("users").insert({username: username, encrypted_password: hash, salt: salt})
}

function saltHashPassword ({
    password,
    salt = randomString()
}) {

    const hash = crypto
        .createHmac("sha512", salt)
        .update(password)
        
    return {
        salt: salt,
        hash: hash.digest("hex")
    }
}

function randomString () {
    return crypto.randomBytes(4).toString("hex");
}

function getUserID (user) {
    return knex("users")
    .select("id")
    .where({
        username:user
    })
}

module.exports = {createList, getLists, deleteList, 
                  createCard, getCards, deleteCard, 
                  updateCard, registerUser, authenticateUser,
                  checkDuplicateUsername, getUserID};