
exports.up = async function(knex, Promise) {
      await knex.schema.table("lists", table => {
            table.integer("user_id").notNullable()
        })
};

exports.down = function(knex, Promise) {
      return knex.schema.table('lists', t => {
        t.dropColumn('user_id')
    })
};
