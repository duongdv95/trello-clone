
exports.up = function(knex, Promise) {
    return knex.schema.createTable("cards", function(table) {
        table.increments("id").unsigned().primary()
        table.string("card").notNullable()
        table.string("list_id").notNullable()
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("cards")
};
