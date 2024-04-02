import pkg from 'pg'

const { Pool, Client } = pkg

const pool = new Pool({
  allowExitOnIdle: true,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGNAME,
  ssl: true
})

const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGNAME,
  ssl: true
})

client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database')
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err)
  })

// USUARIOS
const getUserByEmail = async (email) => {
  const consulta = 'SELECT * FROM users WHERE userEmail = $1;'
  const {
    rows: [user]
  } = await pool.query(consulta, [email])
  return user
}

const newUser = async (
  profile_id,
  userName,
  userEmail,
  userAddress,
  password,
  userPhone,
  city,
  region
) => {
  const consulta = `INSERT INTO users 
    (username, useremail, useraddress, userphone, password, profile_id, city, region) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`

  const values = [
    userName,
    userEmail,
    userAddress,
    userPhone,
    password,
    profile_id,
    city,
    region
  ]
  const {
    rows: [user]
  } = await pool.query(consulta, values)
  return user
}

const getUserById = async (user_id) => {
  const query = 'SELECT * FROM user WHERE user_id = $1'
  const { rows: perfil } = await pool.query(query, [user_id])
  return perfil
}

const checkEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE userEmail = $1'
  const { rowCount } = await pool.query(query, [email])
  return rowCount
}

const updateUser = async (
  user_id,
  useremail,
  useraddress,
  userphone,
  city,
  region
) => {
  const values = [useremail, useraddress, userphone, city, region, user_id]
  const consulta =
    'UPDATE users SET useremail = $1, useraddress = $2, userphone = $3, city = $4, region= $5 WHERE user_id = $6'
  const { rowCount } = await pool.query(consulta, values)
  return rowCount
}

// PRODUCTOS
const getProducts = async () => {
  const query = 'SELECT * FROM products'
  try {
    const data = await client.query(query)
    return data.rows
  } catch (error) {
    throw new Error(error)
  }
}

const addProduct = async (productName, price, description, image) => {
  const values = [productName, price, description, image]
  const consulta =
    'INSERT INTO products (productName, price, description, image) VALUES ($1, $2, $3, $4)'
  const { rowCount } = await pool.query(consulta, values)
  // console.log(values)
  return rowCount
}

const deleteProduct = async (product_id) => {
  const query = 'DELETE FROM products WHERE product_id= $1'
  const { rowCount } = await pool.query(query, [product_id])
  return rowCount
}

// FAVORITOS
const getFavByUser = async (user_id) => {
  const query =
    'SELECT * FROM fav AS f JOIN products AS p ON f.product_id = p.product_id WHERE f.user_id = $1 ORDER BY p.product_id DESC'
  const { rows: products } = await pool.query(query, [user_id])

  return { products }
}

const addToFav = async (user_id, product_id) => {
  const consulta =
    'INSERT INTO fav (user_id, product_id) values ($1, $2) RETURNING *;'
  const {
    rows: [fav]
  } = await pool.query(consulta, [user_id, product_id])
  return fav
}

const deleteFavById = async (user_id, product_id) => {
  const query = 'DELETE FROM fav WHERE user_id= $1 AND product_id= $2'
  const { rowCount } = await pool.query(query, [user_id, product_id])
  return rowCount
}

// CARRITO
const addToCart = async (userId, productId, cantidad) => {
  const query = 'INSERT INTO userCart (user_id, product_id, cantidad) VALUES ($1, $2, $3) RETURNING *';
    try {
        const response = await pool.query(query, [userId, productId, cantidad]);
        return response.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

const getCartByUserId = async (userId) => {
  const query = 'SELECT * FROM userCart WHERE user_id = $1';
    try {
        const response = await pool.query(query, [userId]);
        return response.rows;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteFromCart = async (userId, productId) => {
    const query = 'DELETE FROM userCart WHERE user_id = $1 AND product_id = $2';
    try {
        const response = await pool.query(query, [userId, productId]);
        return response.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

export const jbModel = {
  getUserByEmail,
  newUser,
  getUserById,
  updateUser,
  addProduct,
  deleteProduct,
  getFavByUser,
  addToFav,
  deleteFavById,
  getProducts,
  checkEmail,
  addToCart,
  deleteFromCart,
  getCartByUserId
}
