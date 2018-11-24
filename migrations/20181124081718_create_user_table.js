exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", function(table) {
        table.increments("id").unsigned().primary()
        table.string("username").notNullable()
        table.string("encrypted_password").notNullable()
        table.string("salt").notNullable()
        table.timestamps(false, true)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("users");
};
