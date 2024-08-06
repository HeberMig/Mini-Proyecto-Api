
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return await knex.schema.createTable('sale', (table) => {
        table.increments('sale_id').primary();
        table.date('date').notNullable();
        table.integer('customer_id').unsigned().references('customer_id').inTable('customer').onDelete('CASCADE');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.dropTable('sale');
};
