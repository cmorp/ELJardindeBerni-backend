import Jwt from 'jsonwebtoken'
import { jbModel } from '../config/consultas.js'


export const verifyUpdateUser = (req, res, next) => {
  try {
    const { userName, userEmail, userPhone, userAddress, region, city } =
      req.body
    if (
      !userName ||
      !userEmail ||
      !userPhone ||
      !userAddress ||
      !region ||
      !city
    ) {
      throw { code: 400, message: 'Faltan campos requeridos.' }
    }

    if (userName.length < 3 || userName.length > 50) {
      throw {
        code: 400,
        message: 'El nombre de usuario debe tener entre 3 y 50 caracteres.'
      }
    }

    if (userEmail.length < 10 || userEmail.length > 50) { 
      throw {
        code: 400,
        message: 'El correo electrónico debe tener entre 10 y 50 caracteres.'
      }
    }

    if (password.length < 6 || password.length > 60) {
      throw {
        code: 400,
        message: 'La contraseña debe tener entre 6 y 60 caracteres.'
      }
    }

    if (userPhone.length < 8 || userPhone.length > 12) { 
      throw {
        code: 400,
        message: 'El teléfono debe tener entre 8 y 12 caracteres.'
      }
    }

    if (userAddress.length < 10 || userAddress.length > 25) { 
      throw {
        code: 400,
        message: 'La dirección debe tener entre 10 y 25 caracteres.'
      }
    }

    if (region.length < 5 || region.length > 25) { 
      throw {
        code: 400,
        message: 'La región debe tener entre 5 y 25 caracteres.'
      }
    }

    if (city.length < 5 || city.length > 25) { 
      throw {
        code: 400,
        message: 'La ciudad debe tener entre 5 y 25 caracteres.'
      }
    }
    
    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(useremail)
    if (!isEmailValid) {
      throw { code: 400, message: 'El email proporcionado no es válido.' }
    }

    next()
  } catch (error) {
    const { code, message } = error
    console.log(error)
    res
      .status(code || 500)
      .json({ ok: false, message: message || 'Error interno del servidor.' })
  }
}

export const verifyRegisterUser = (req, res, next) => {
  try {
    const {
      profile_id,
      userName,
      userEmail,
      userPhone,
      password,
      password2,
      userAddress,
      region,
      city
    } = req.body
    if (
      !profile_id ||
      !userName ||
      !userEmail ||
      !userPhone ||
      !password ||
      !password2 ||
      !userAddress ||
      !region ||
      !city
    ) {
      throw { code: 400, message: 'Faltan campos requeridos.' }
    }

    if (userName.length < 3 || userName.length > 50) {
      throw {
        code: 400,
        message: 'El nombre de usuario debe tener entre 3 y 50 caracteres.'
      }
    }

    if (userEmail.length < 10 || userEmail.length > 50) { 
      throw {
        code: 400,
        message: 'El correo electrónico debe tener entre 10 y 50 caracteres.'
      }
    }

    if (password.length < 6 || password.length > 60) {
      throw {
        code: 400,
        message: 'La contraseña debe tener entre 6 y 60 caracteres.'
      }
    }

    if (userPhone.length < 8 || userPhone.length > 12) { 
      throw {
        code: 400,
        message: 'El teléfono debe tener entre 8 y 12 caracteres.'
      }
    }

    if (userAddress.length < 10 || userAddress.length > 25) { 
      throw {
        code: 400,
        message: 'La dirección debe tener entre 10 y 25 caracteres.'
      }
    }

    if (region.length < 5 || region.length > 25) { 
      throw {
        code: 400,
        message: 'La región debe tener entre 5 y 25 caracteres.'
      }
    }

    if (city.length < 5 || city.length > 25) { 
      throw {
        code: 400,
        message: 'La ciudad debe tener entre 5 y 25 caracteres.'
      }
    }

    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(userEmail)
    if (!isEmailValid) {
      throw { code: 400, message: 'El email proporcionado no es válido.' }
    }

    if (password !== password2) {
      throw { code: 400, message: 'Las contraseñas no coinciden.' }
    }

    next()
  } catch (error) {
    const { code, message } = error
    console.log(error)
    res
      .status(code || 500)
      .json({ ok: false, message: message || 'Error interno del servidor.' })
  }
}

export const verifyCredentials = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization')

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ ok: false, message: 'Token no proporcionado.' })
    }

    const token = authorizationHeader.split('Bearer ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ ok: false, message: 'Formato de token no válido.' })
    }

    const payload = Jwt.verify(token, process.env.JWT_PASSWORD)

    if (!payload) {
      return res.status(401).json({ ok: false, message: 'Token inválido.' })
    }

    req.body.email = payload.email
    const { usuario_id } = await jbModel.getUserByEmail(payload.email)
    req.body.usuario_id = usuario_id

    next()
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: 'Error interno del servidor' })
  }
}


export const configCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
}