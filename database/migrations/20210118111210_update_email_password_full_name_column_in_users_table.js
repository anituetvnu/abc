exports.up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('email', 127).collate('latin1_general_ci').notNullable().alter();
    table.string('password', 127).collate('latin1_general_ci').notNullable().alter();
    table.string('full_name', 127).collate('utf8_general_ci').notNullable().alter();
  });
};

exports.down = async () => {
};
