
exports.up = function(knex, Promise) {
    return knex.schema.createTable("lists", function(table) {
        table.increments("id").unsigned().primary()
        table.string("list_name").notNullable()
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("lists")
};
