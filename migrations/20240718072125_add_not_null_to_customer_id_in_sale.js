
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return await knex.schema.alterTable('sale', (table) => {
        table.integer('customer_id').unsigned().notNullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.alterTable('sale', (table) => {
        table.integer('customer_id').unsigned().alter();
        });
};
