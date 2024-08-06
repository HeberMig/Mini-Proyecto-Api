import express from "express";
import db from "./db.js";
import knex from "knex";

const api = express();

api.use(express.json());

//Cuando vamos a crear datos es mejor usar el body
//INGRESAMOS DATOS A LA DB
api.post("/customers", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    postal_code,
    neighborhood_colony,
    city,
  } = req.body;

  //Validar que vengan todos los campos
  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !address ||
    !postal_code ||
    !neighborhood_colony ||
    !city
  ) {
    return res.status(400).json({
      msg: "Invalid body",
    });
  }

  try {
    //Usar db importador hasta arriba
    const newCustomer = await db("customer")
      //dentro de .insert() podemos mandar un obj -> {}
      .insert({
        first_name,
        last_name,
        email,
        phone,
        address,
        postal_code,
        neighborhood_colony,
        city,
      })
      //Lo que regresa una vez que se haya registrado el nuevo customer
      .returning("*");

    //Regresamos al cliente un 200 con el nuevo customer
    return res.status(201).json({
      msg: "Cliente registrado",
      customer: newCustomer,
    });
  } catch (error) {
    //Si ocurre algún error dentro del try
    console.error(error);
    return res.status(500).json({
      msg: "Error registrando cliente",
    });
  }
});

//Consultamos todos los customers por ------------------------------------------ customers
api.get("/customers", async (req, res) => {
  try {
    //consultamos todas las columnas con '*' con .from() elegimos la tabla
    const customers = await db.select("*").from("customer");
    return res.json({
      msg: "Clientes obtenidos",
      customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo todos los clientes",
    });
  }
});

//Consultar cliente por id ------------------------------------------customers
api.get("/customers/:customerId", async (req, res) => {
  const { customerId } = req.params;
  //Consultamos el customer por el id que le pasamos por params
  if (!customerId || customerId.trim() === "") {
    return res.status(400).json({
      msg: "El parámetro customerId es inválido",
    });
  }
  if (isNaN(customerId)) {
    return res.status(400).json({
      msg: "El parámetro customerId debe ser un número",
    });
  }

  try {
    const customer = await db
      .select("*")
      .from("customer")
      .where({
        customer_id: customerId,
      })
      .first();
    if (!customer) {
      return res.status(404).json({
        msg: "Cliente no encontrado",
      });
    }

    return res.json({
      msg: "Cliente encontrado",
      customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo cliente por id",
    });
  }
});

//MODIFICAR CLIENTE POR ID-------------------------------------MODFICAR
//Ruta: ejmplo /customers/1 HttpMethod: PUT
api.put("/customers/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    postal_code,
    neighborhood_colony,
    city,
  } = req.body;

  //Consultamos el customer por el id que le pasamos por params
  //Validar que customer id nos lo pasen y que no este vacío

  if (!customerId || isNaN(customerId) || customerId.trim() === "") {
    return res.status(400).json({
      msg: "Body inválido",
    });
  }

  //Validar que al menos uno de los campos a actualizar este
  //seteado en el body
  if (
    !first_name &&
    !last_name &&
    !email &&
    !phone &&
    !address &&
    !postal_code &&
    !neighborhood_colony &&
    !city
  ) {
    return res.status(400).json({
      msg: "Debe actualizar al menos un campo",
    });
  }

  try {
    //De la tabla customers
    const updated = await db("customer")
      //.update() acepta como param un {}
      .update({
        first_name,
        last_name,
        email,
        phone,
        address,
        postal_code,
        neighborhood_colony,
        city,
      })
      //Actualizar solamente el employee con id específico
      .where({
        customer_id: customerId,
      })
      //Si no agrego .returnin() la fn update regresa un number con la cantidad de registros actualizados
      .returning("*");

    return res.json({
      msg: "Cliente actualizado",
      customer: updated[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error la actulizacion del  cliente",
    });
  }
});

//ELMINAR UN REGISTRO POR ID
api.delete("/customers/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!customerId || isNaN(customerId) || customerId.trim() === "") {
    return res.status(400).json({
      msg: "Body inválido",
    });
  }

  try {
    await db("customer").delete().where({
      customer_id: customerId,
    });

    return res.json({
      msg: "Cliente borrado",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al borrar cliente",
    });
  }
});

//INSERTAMOS PRODUCTOS
api.post("/products", async (req, res) => {
  const { name, description, price, sku } = req.body;

  //Validar campos
  if (!name || !description || !price || !sku) {
    return res.status(400).json({
      msg: "Invalid body",
    });
  }

  try {
    //Usar db importador hasta arriba
    const newProduct = await db("product")
      //dentro de .insert() podemos mandar un obj -> {}
      .insert({
        name,
        description,
        price,
        sku,
      })
      //Lo que regresa una vez que se haya registrado el nuevo empleado
      .returning("*");

    //Regresamos al cliente un 200 con el nuevo empleado
    return res.status(201).json({
      msg: "Producto registrado",
      customer: newProduct,
    });
  } catch (error) {
    //Si ocurre algún error dentro del try
    console.error(error);
    return res.status(500).json({
      msg: "Error registrando producto",
    });
  }
});

//INSERTAR VENTAS
api.post("/sales", async (req, res) => {
  const { date, customer_id } = req.body;

  //Validar campos
  if (!date || !customer_id) {
    return res.status(400).json({
      msg: "Invalid body",
    });
  }

  try {
    //Usar db importador hasta arriba
    const newSale = await db("sale")
      //dentro de .insert() podemos mandar un obj -> {}
      .insert({
        date,
        customer_id,
      })
      //Lo que regresa una vez que se haya registrado el nuevo empleado
      .returning("*");

    //Regresamos al cliente un 200 con el nuevo empleado
    return res.status(201).json({
      msg: "Venta registrada",
      customer: newSale,
    });
  } catch (error) {
    //Si ocurre algún error dentro del try
    console.error(error);
    return res.status(500).json({
      msg: "Error registrando venta",
    });
  }
});

//INSERTAR DATOS COMO VENTA-DETALLES----------------------------------------
api.post("/detail-sales", async (req, res) => {
  const { sale_id, product_id, quantity } = req.body;

  //console.log('Datos recibidos en la solicitud', req.body);

  //Validar campos
  if (!sale_id || !product_id || !quantity) {
    return res.status(400).json({
      msg: "Invalid body",
    });
  }

  try {
    //Usar db importador hasta arriba
    const newDetailSales = await db("detail_sale")
      //dentro de .insert() podemos mandar un obj -> {}
      .insert({
        sale_id,
        product_id,
        quantity,
      })
      //Lo que regresa una vez que se haya registrado el nuevo empleado
      .returning("*");

    //Regresamos al cliente un 200 con el nuevo empleado
    return res.status(201).json({
      msg: "Detalle Venta registrada",
      customer: newDetailSales,
    });
  } catch (error) {
    //Si ocurre algún error dentro del try
    console.error(error);
    return res.status(500).json({
      msg: "Error registrando Detalle venta",
    });
  }
});

// EJERCICIO 1:  ID de los clientes de la Ciudad de Monterrey.
api.get("/customers/city/:city", async (req, res) => {
  const { city } = req.params;
  //Consultamos el customer por el id que le pasamos por params

  try {
    const customers = await db("customer").select("*").where({
      city: city,
    });
    //Regresamos al cliente un 200 con el nuevo empleado
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron clientes para la ciudad especificada",
      });
    }

    return res.json({
      msg: "Cliente encontrado",
      customers: customers,
      //customers : customers.map(customer => customer.customer_id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo cliente por ciudad",
    });
  }
});

// EJERCICO 2: ID y descripción de los productos que cuesten menos de 15 pesos.

api.get("/products/", async (req, res) => {
  //Consultamos el customer por el id que le pasamos por params
  try {
    const products = await db("product")
      .select("product_id", "description", "price")
      .where("price", "<", 15)
      .orderBy("price", "asc");
    //Regresamos al cliente un 200 con el nuevo empleado
    if (!products || products.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron productos",
      });
    }
    return res.json({
      msg: "Productos encontrados",
      products: products,
      //customers : customers.map(customer => customer.customer_id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo productos",
    });
  }
});

// EJERCICO 3: ID y nombre de los clientes, cantidad vendida, y descripción del producto, en las
// ventas en las cuales se vendieron más de 10 unidades.
api.get("/sales/", async (req, res) => {
  try {
    const sales = await db("customer as c")
      .select(
        "c.customer_id",
        "c.first_name",
        "c.last_name",
        "ds.quantity",
        "p.name",
        "p.description"
      )
      .join("sale as s", "c.customer_id", "s.customer_id")
      .join("detail_sale as ds", "s.sale_id", "ds.sale_id")
      .join("product as p", "ds.product_id", "p.product_id")
      .where("ds.quantity", ">", 10)
      .orderBy("ds.quantity", "desc");
    if (!sales || sales.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron ventas",
      });
    }
    return res.json({
      msg: "Ventas encontradas",
      sales: sales,
      //customers : customers.map(customer => customer.customer_id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo ventas",
    });
  }
});

// EJERCICIO 4: ID y nombre de los clientes que no aparecen en la tabla de ventas (Clientes que no
// han comprado productos).

api.get("/noSale", async (req, res) => {
  try {
    const customers = await db("customer as c")
      .select("c.customer_id", "c.first_name", "c.last_name")
      .leftJoin("sale as s", "c.customer_id", "s.customer_id")
      .whereNull("s.customer_id");
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron clientes sin ventas",
      });
    }
    return res.json({
      msg: "Clientes sin ventas encontrados",
      customers: customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error obteniendo clientes sin ventas",
    });
  }
});

//EJERCICO 5: ID y nombre de los clientes que han comprado todos los productos de la empresa.
api.get("/sold", async (req, res) => {
  try {
    const customers = await db.raw(`
      SELECT c.customer_id, c.first_name, c.last_name
      FROM customer AS c
      JOIN sale AS s ON c.customer_id = s.customer_id
      JOIN detail_sale AS ds ON s.sale_id = ds.sale_id
      JOIN product AS p ON ds.product_id = p.product_id
      GROUP BY c.customer_id, c.first_name, c.last_name
      HAVING COUNT(DISTINCT p.product_id) = (SELECT COUNT(*) FROM product);

    `);

    if (customers.rows.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron clientes que hayan comprado todos los productos",
      });
    }

    return res.json({
      msg: "Clientes que han comprado todos los productos",
      customers: customers.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al obtener los clientes",
    });
  }
});
//EJERCICIO 6: ID y nombre de cada cliente y la suma total (suma de cantidad) de los productos
// que ha comprado. Pista:
// (https://www.postgresqltutorial.com/postgresql-sum-function/ ).
api.get("/total", async (req, res) => {
  try {
    const customers = await db.raw(`
      SELECT c.customer_id, c.first_name, c.last_name, SUM(ds.quantity) AS total_productos
      FROM customer AS c
      JOIN sale AS s ON c.customer_id = s.customer_id
      JOIN detail_sale AS ds ON s.sale_id = ds.sale_id
      GROUP BY c.customer_id, c.first_name, c.last_name
      `);
    if (customers.rows.length === 0) {
      return res.status(404).json({
        msg: "No se encontraron clientes que hayan comprado todos los productos",
      });
    }
    return res.json({
      msg: "Clientes que han comprado todos los productos",
      customers: customers.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error al obtener los clientes",
    });
  }
});

// EJERCICO 7: ID de los productos que no han sido comprados por clientes de Guadalajara.
api.get("/unsold-products/:city?", async (req, res) => {
  try {
    const city = req.params.city;

    if (!city || !city.trim()) {
      return res.status(400).json({
        msg: "La ciudad no puede estar vacía",
      });
    }

    const cityExits = await db.raw(
      `
        SELECT 1 
        FROM customer 
        WHERE city = ? 
        LIMIT 1
        `,
      [city]
    );

    if (cityExits.rows.length === 0) {
      return res.status(404).json({
        msg: "La ciudad no existe",
      });
    }

    const products = await db.raw(
      `
          SELECT p.product_id, p.name, p.price, p.description
          FROM product AS p
          WHERE p.product_id NOT IN (
          SELECT ds.product_id
          FROM customer AS C
          JOIN sale AS s ON c.customer_id = s.customer_id
          JOIN detail_sale AS ds ON s.sale_id = ds.sale_id
          WHERE c.city = ?
          ) 
          `,
      [city]
    );

    if (products.rows.length === 0) {
      return res.status(404).json({
        msg: `No se encontraron productos no vendidos en la ciudad ${city}`,
      });
    }

    return res.json({
      msg: `Productos no vendidos en la ciudad ${city}`,
      products: products.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mesg: "Error al obtener los productos no vendidos",
    });
  }
});

// ○ ID de los productos que se han vendido a clientes de Monterrey y que también se
// han vendido a clientes de Cancún.
api.get("/products-sold-customers-citys", async (req, res) => {
  try {
    const { city1, city2 } = req.query;

    if (!city1 || !city2) {
      return res.status(400).json({
        msg: "Se deben proporcionar dos ciudades",
      });
    }
    const { rows } = await db.raw(
      `
      SELECT p.product_id, p.name, p.description
      FROM product AS p
      WHERE EXISTS (
          SELECT 1
          FROM detail_sale ds1
          JOIN sale s1 ON ds1.sale_id = s1.sale_id
          JOIN customer c1 ON s1.customer_id = c1.customer_id
          WHERE c1.city = ?
            AND ds1.product_id = p.product_id
        ) AND EXISTS (
          SELECT 1
          FROM detail_sale ds2
          JOIN sale s2 ON ds2.sale_id = s2.sale_id
          JOIN customer c2 ON s2.customer_id = c2.customer_id
          WHERE c2.city = ?
            AND ds2.product_id = p.product_id
      );
      `,
      [city1, city2]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        msg: `No se encontraron productos vendidos en las ciudades ${city1} y ${city2}
          `,
      });
    }
    return res.json({
      msg: `Productos vendidos en las ciudades ${city1} y ${city2}`,
      products: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mesg: "Error al obtener los productos vendidos en las ciudades",
    });
  }
});

// EJERCICIO 9: Nombre de las ciudades en las que se han vendido todos los productos.
api.get('/products/sold-in-all-cities', async (req, res) => {
  try {
    const { rows } = await db.raw(`
      SELECT city 
      FROM (
      SELECT c.city, COUNT(DISTINCT p.product_id) AS total_products
        FROM customer c
        JOIN sale s ON c.customer_id = s.customer_id
        JOIN detail_sale ds ON s.sale_id = ds.sale_id
        JOIN product p ON ds.product_id = p.product_id
        GROUP BY c.city
      ) AS sale_for_city
    WHERE total_products = (SELECT COUNT(*) FROM product)
    `);

  if(rows.length === 0){
    return res.json({
      mesg: 'No hay ciudades donde se hayan vendido todos los productos',
      ciudades: []
    });
  }

  res.json({
    mesg: 'Ciudades donde se han vendido todos los productos',
    ciudades: rows
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error al obtener los productos vendidos en todas las ciudades",
      });
      }
    });
       
  


//servidor corriendo
api.listen(8000, () => {
  console.log("Server running on port 8000");
});
