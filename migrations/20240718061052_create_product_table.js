
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return await knex.schema.createTable('product', (table) => {
    table.increments('product_id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('sku').notNullable();

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.dropTable('product');
  
};
