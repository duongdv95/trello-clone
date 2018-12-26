
exports.up = async function(knex, Promise) {
    await knex.schema.table("cards", table => {
            table.integer("position").notNullable()
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('cards', t => {
        t.dropColumn('position')
    })
};
