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

async function updateCard({cardID, listID, updatedCard}) {
    const updateStatus = await knex("cards").where({id: cardID}).update({card: updatedCard, list_id: listID})
    return updateStatus
}

// async function updateCardIndex() {
//     await knex("cards").where({id: cardID}).update({index})
// }

module.exports = {createList, getLists, deleteList, 
                  createCard, getCards, deleteCard, 
                  updateCard};