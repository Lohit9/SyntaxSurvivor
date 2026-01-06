import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { getTopScores, addScore } from './db.js'

const app = express()
const PORT = 3000

// CORS configuration for localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  })
})

// Game info endpoint
app.get('/api/game', (_req: Request, res: Response) => {
  res.json({ 
    name: 'Syntax Survivor',
    version: '1.0.0',
    status: 'ready'
  })
})

// GET /api/scores - Returns top 10 high scores
app.get('/api/scores', (_req: Request, res: Response) => {
  try {
    const scores = getTopScores(10)
    res.json({ scores })
  } catch (error) {
    console.error('Error fetching scores:', error)
    res.status(500).json({ error: 'Failed to fetch scores' })
  }
})

// POST /api/scores - Add a new score
app.post('/api/scores', (req: Request, res: Response) => {
  try {
    const { username, score } = req.body

    // Validate input
    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Username is required and must be a string' })
      return
    }

    if (score === undefined || typeof score !== 'number' || !Number.isFinite(score)) {
      res.status(400).json({ error: 'Score is required and must be a valid number' })
      return
    }

    // Sanitize username (limit length, trim whitespace)
    const sanitizedUsername = username.trim().slice(0, 50)
    
    if (sanitizedUsername.length === 0) {
      res.status(400).json({ error: 'Username cannot be empty' })
      return
    }

    // Ensure score is a non-negative integer
    const sanitizedScore = Math.max(0, Math.floor(score))

    // Add the score
    const newScore = addScore(sanitizedUsername, sanitizedScore)
    
    // Return the updated top 10 scores
    const scores = getTopScores(10)
    res.status(201).json({ 
      message: 'Score added successfully',
      added: newScore,
      scores 
    })
  } catch (error) {
    console.error('Error adding score:', error)
    res.status(500).json({ error: 'Failed to add score' })
  }
})

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Handle 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
