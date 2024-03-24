import DB from './config.js'
import cors from 'cors'
import express from 'express'
import jbRoutes from './routes/routes.js'
import { configCors } from './middlewares/middlewares.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(configCors)
app.use(jbRoutes)

const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello!'))

app.listen(PORT, () =>
  console.log('\x1b[36m', `Server listening on http://localhost:${PORT}!`)
)