
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return await knex.schema.createTable('customer', (table) => {
        table.increments('customer_id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.string('address').notNullable();
        table.string('postal_code').notNullable();
        table.string('neighborhood_colony').notNullable();
        table.string('city').notNullable();    
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.dropTable('customer');
};
