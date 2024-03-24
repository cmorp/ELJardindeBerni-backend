import { Router } from 'express'
import { jbController } from '../controller/controller.js'
import {
  verifyRegisterUser,
  verifyCredentials,
  verifyUpdateUser
} from '../middlewares/middlewares.js'


const router = Router()


// RUTAS PÚBLICAS
router.post('/public/register', verifyRegisterUser, jbController.userRegister)
router.post('/public/login', jbController.userLogin)
router.get('/public/products', jbController.getProducts)

// RUTAS PRIVADAS PARA PERFIL DE USUARIO
router.get('/private/profile', verifyCredentials, jbController.getUserById)
router.put('/private/profile', verifyCredentials, verifyUpdateUser, jbController.updateUser)

// RUTAS PRIVADAS PARA PRODUCTOS DEL USUARIO
router.post('/private/users/products', verifyCredentials, jbController.addProduct)
router.delete('/private/users/products', verifyCredentials, jbController.deleteProduct)

// RUTAS PRIVADAS PARA FAVORITOS DEL USUARIO
router.get('/private/users/favs', verifyCredentials, jbController.getFavByUser)
router.post('/private/users/favs', verifyCredentials, jbController.addToFav)
router.delete('/private/users/favs', verifyCredentials, jbController.deleteFav)


export default router