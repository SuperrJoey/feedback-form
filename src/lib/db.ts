import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool 