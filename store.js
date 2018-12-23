const knexfile                = require("./knexfile.js"),
      knex                    = require("knex")(knexfile);
    

async function createList(listTitle) {
    const listId = await knex("lists").insert({list_name: listTitle})
    return listId
}

async function getLists() {
    const listsQuery = await knex("lists").select("list_name", "id")
    const listObjects = listsQuery.map(function(element) {
        return {listName: element.list_name, id: element.id}
    })
    return listObjects;
}

async function getCards() {
    const listsQuery = await knex("cards").select("id", "card", "list_id")
    const listObjects = listsQuery.map(function(element) {
        return {cardDescription: element.card, id: element.id, listID: element.list_id}
    })
    return listObjects;
}

async function deleteList(listID) {
    const deleteStatus = await knex("lists").select("list_name").del().where({id: listID})
    return (deleteStatus == 1) ? true : false
}

async function createCard({cardDescription, listID}) {
    const cardID = await knex("cards").insert({card: cardDescription, list_id: listID})
    return cardID
}

module.exports = {createList, getLists, deleteList, createCard, getCards};