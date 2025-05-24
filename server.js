import express from 'express'
import pkg from 'pg'
import cors from 'cors'

const { Pool } = pkg
const app = express()

app.use(cors())
app.use(express.json())

// Your Neon connection string
const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL || "your_connection_string_here"

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
})

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message)
  } else {
    console.log('Database connected successfully!')
  }
})

app.post('/api/feedback', async (req, res) => {
  try {
    console.log('Received POST request:', req.body)
    const { name, relationship, mood, message, rating, timestamp } = req.body
    const result = await pool.query(
      `INSERT INTO feedbacks (name, relationship, mood, message, rating, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, relationship, mood, message, rating, timestamp]
    )
    console.log('Insert successful:', result.rows[0])
    res.json(result.rows[0])
  } catch (error) {
    console.error('POST /api/feedback error:', error.message)
    res.status(500).json({ error: 'Failed to save feedback', details: error.message })
  }
})

app.get('/api/feedback', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedbacks ORDER BY timestamp DESC')
    console.log('Fetched feedbacks:', result.rows.length)
    res.json(result.rows)
  } catch (error) {
    console.error('GET /api/feedback error:', error.message)
    res.status(500).json({ error: 'Failed to fetch feedbacks', details: error.message })
  }
})

app.delete('/api/feedback', async (req, res) => {
  try {
    const id = req.query.id
    await pool.query('DELETE FROM feedbacks WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/feedback error:', error.message)
    res.status(500).json({ error: 'Failed to delete feedback', details: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 