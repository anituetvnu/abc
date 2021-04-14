exports.up = async (knex) => {
  await knex.schema.table('users', (table) => {
    table.integer('task_count').unsigned().notNullable().defaultTo(0)
      .after('full_name');
  });
};

exports.down = async () => {
};
