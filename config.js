import dotenv from 'dotenv'
dotenv.config({ silent: true })

export default {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGNAME,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
}