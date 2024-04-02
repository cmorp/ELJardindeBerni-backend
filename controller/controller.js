import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { jbModel } from '../config/consultas.js'


// AUTENTICACIÓN DE USUARIO
const userLogin = async (req, res) => {
  try {
    const { userEmail, password } = req.body
    if (!userEmail || !password) {
      return res.status(400).json({
        ok: false,
        message: 'El email y la contraseña son requeridos.'
      })
    }

    const user = await jbModel.getUserByEmail(userEmail)
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: `El email: ${userEmail} no está registrado.`
      })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)
    if (!verifyPassword) {
      return res
        .status(400)
        .json({ ok: false, message: 'Contraseña incorrecta.' })
    }

    const token = Jwt.sign({ email: userEmail }, process.env.JWT_PASSWORD)

    res
      .status(200)
      .json({ token, ok: true, message: 'Login exitoso.', usuario: user })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}

const userRegister = async (req, res) => {
  try {
    const {
      profile_id,
      userName,
      userEmail,
      userPhone,
      password,
      userAddress,
      region,
      city
    } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)

    const checkEmail = await jbModel.checkEmail(userEmail)
    if (checkEmail > 0) {
      return res.status(400).json({
        ok: false,
        message: `El email ${userEmail} ya está registrado.`
      })
    }

    const result = await jbModel.newUser(
      profile_id,
      userName,
      userEmail,
      userAddress,
      encryptedPassword,
      userPhone,
      city,
      region
    )
    if (!result) {
      return res
        .status(400)
        .json({ ok: false, message: 'Registro del usuario fallido.' })
    }

    res.status(201).json({ ok: true, message: 'Registro del usuario exitoso.' })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}

const updateUser = async (req, res) => {
  try {
    const { user_id, useremail, useraddress, userphone, city, region } =
      req.body

    const result = await jbModel.updateUser(
      user_id,
      useremail,
      useraddress,
      userphone,
      city,
      region
    )
    if (!result) {
      return res
        .status(400)
        .json({ ok: false, message: 'Actualización del usuario fallida.' })
    }

    return res
      .status(201)
      .json({ ok: true, message: 'Actualización del usuario exitoso.' })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}

const getUserById = async (req, res) => {
  try {
    const { user_id } = req.body
    if (!user_id) {
      return res
        .status(400)
        .json({ ok: false, message: 'El Id del usuario es requerido.' })
    }

    const perfil = await jbModel.getProfile(user_id)
    if (!perfil) {
      return res
        .status(400)
        .json({ ok: false, message: 'Usuario no registrado.' })
    }

    res.status(200).json({ ok: true, message: 'Usuario encontrado.', perfil })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}



// PRODUCTOS
const addProduct = async (req, res) => {
  try {
    const { productName, price, description, image } = req.body
    const products = await jbModel.addProduct({
      productName,
      price,
      description,
      image
    })
    return res
      .status(201).json({
        ok: true, message: 'El producto se ha agregado con éxito.',
        result: products
      })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ ok: false, message: 'Error al agregar un nuevo producto.' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body
    if (!product_id) {
      return res
        .status(400)
        .json({ ok: false, message: 'Id del producto no proporcionado.' })
    }

    const result = await jbModel.deleteProduct(product_id)
    if (!result) {
      return res
        .status(400)
        .json({ ok: false, message: 'Producto no encontrado.' })
    }

    res.status(200).json({ ok: true, message: 'Producto eliminado con éxito.' })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await jbModel.getProducts()
    res.status(200).json({
      ok: true,
      message: 'Productos obtenidos con éxito.',
      results: products
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ ok: false, message: 'Error al obtener los productos.' })
  }
}



// FAVORITOS
const addToFav = async (req, res) => {
  try {
    const { user_id, product_id } = req.body

    if (!user_id || !product_id) {
      return res
        .status(400)
        .json({ ok: false, message: 'Faltan campos requeridos.' })
    }

    const result = await jbModel.addToFav(user_id, product_id)

    if (!result) {
      return res
        .status(400)
        .json({ ok: false, message: 'Registro de favorito fallido.' })
    }

    return res.status(201).json({
      ok: true,
      message: 'Registro de favorito exitoso.',
      results: result
    })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor.' })
  }
}

const deleteFav = async (req, res) => {
  try {
    const { user_id, product_id } = req.body
    if (!user_id || !product_id) {
      return res
        .status(400)
        .json({ ok: false, message: 'Faltan campos requeridos.' })
    }

    const result = await jbModel.deleteFavById(user_id, product_id)
    if (!result) {
      return res
        .status(400)
        .json({ ok: false, message: 'Favorito no encontrado.' })
    }

    res.status(200).json({ ok: true, message: 'Favorito eliminado con éxito.' })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}

const getFavByUser = async (req, res) => {
  try {
    const { user_id } = req.query
    if (!user_id) {
      return res
        .status(400)
        .json({ ok: false, message: 'El Id del usuario es requerido.' })
    }

    const { products } = await jbModel.getFavByUser(user_id)

    res.status(200).json({
      ok: true,
      message: 'Productos favoritos del usuario.',
      results: products
    })
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}



// CARRITO
const getCart = async (req, res) => {
  const { userId } = req.params
  try {
    const cart = await jbModel.getCartByUserId(userId)
    res.status(201).json(cart) 
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor al obtener carrito." })
  }
}

const addProductToCart = async (req, res) => {
  const { productId } = req.params
  const { userId, cantidad } = req.body
  try {
    const addedToCart = await jbModel.addToCart(userId, productId, cantidad)
    if (addedToCart.length <= 0) res.status(204).json({ message: "No se pudo agregar el producto, inténtelo nuevamente." })
    res.status(201).json(addedToCart)
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor al agregar producto." })
  }
}

const deleteProductFromCart = async (req, res) => {
  const { userId, productId } = req.params
  try {
    await Cart.removeFromCart(userId, productId);
    res.status(200).json({ message: 'Producto eliminado exitosamente.' })
  } catch {
    res.status(500).json({ message: 'Error interno del servidor al eliminar producto.' })
  }
}



// CONTROLADOR PRINCIPAL
export const jbController = {
  // Autenticación
  userLogin,
  userRegister,
  updateUser,
  getUserById,

  // Productos
  addProduct,
  deleteProduct,
  getProducts,

  // Favoritos
  addToFav,
  deleteFav,
  getFavByUser,

  // Carrito
  getCart,
  addProductToCart,
  deleteProductFromCart
}