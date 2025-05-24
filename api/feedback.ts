import { Pool } from 'pg'

// For production, set this as an environment variable in Vercel dashboard
const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL || 
  "postgresql://neondb_owner:npg_jJ7n0WlkBFYo@ep-autumn-recipe-a81jjkle-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
})

export default async function handler(req: any, res: any) {
  // Basic CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'POST') {
    try {
      const { name, relationship, mood, message, rating, timestamp } = req.body
      const result = await pool.query(
        `INSERT INTO feedbacks (name, relationship, mood, message, rating, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, relationship, mood, message, rating, timestamp]
      )
      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Failed to save feedback' })
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM feedbacks ORDER BY timestamp DESC')
      res.json(result.rows)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch feedbacks' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const id = req.query.id
      await pool.query('DELETE FROM feedbacks WHERE id = $1', [id])
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete feedback' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
} 