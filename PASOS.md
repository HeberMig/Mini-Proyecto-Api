1. Creamos DB en render.com
2. Conseguimos URI de conexión (host, user, password, name)
3. Guardamos esas variables en `.env`
4. Creamos archivo `knexfile.js` `knex init -x ts`
5. Renombrar ts -> js
6. instalar paquete dotenv `npm i dotenv`
7. Dentro de archvo knexfile.js cargamos dotenv `dotenv.config()`
8. Cambiamos variables development en `knexfile.js` -> `process.env.<Variable de .env>`
9. Creamos archivo `db.js`
10. Creamos CRUD usando db
    - db('employees')
      - .select()
      - .where
      - .from()
      - .delete()
      - .update()
      - .returning()
