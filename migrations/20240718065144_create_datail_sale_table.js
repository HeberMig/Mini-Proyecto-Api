
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return await knex.schema.createTable('detail_sale', (table) => {
        table.increments('detail_sale_id').primary();
        table.integer('sale_id').unsigned().notNullable().references('sale_id').inTable('sale').onDelete('CASCADE');
        table.integer('product_id').unsigned().notNullable().references('product_id').inTable('product').onDelete('CASCADE');
        table.integer('quantity').notNullable();

    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.dropTable('detail_sale');
  
};
