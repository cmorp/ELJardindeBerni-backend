import Jwt from 'jsonwebtoken'
import { jbModel } from '../config/consultas.js'


export const verifyUpdateUser = (req, res, next) => {
  try {
    const { username, useremail, userphone, useraddress, region, city } =
      req.body
    if (
      !username ||
      !useremail ||
      !userphone ||
      !useraddress ||
      !region ||
      !city
    ) {
      throw { code: 400, message: 'Faltan campos requeridos.' }
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
      address,
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
      !address ||
      !region ||
      !city
    ) {
      throw { code: 400, message: 'Faltan campos requeridos.' }
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