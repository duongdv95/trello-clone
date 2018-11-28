const knexfile                = require("./knexfile.js"),
      knex                    = require("knex")(knexfile);
    

async function createList(listTitle) {
    const listID = await knex("lists").insert({list_name: listTitle})
    return listID
}

async function getLists() {
    const listsQuery = await knex("lists").select("list_name", "id")
    const listObjects = listsQuery.map(function(element) {
        return {listName: element.list_name, id: element.id}
    })
    return listObjects;
}

module.exports = {createList, getLists};