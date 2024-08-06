import knex from 'knex';
import configFile from './knexfile.js';

const db = knex(configFile.development);

export default db;
