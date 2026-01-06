import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'highscores.db')

// Ensure data directory exists
import fs from 'fs'
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// Initialize the highscores table
db.exec(`
  CREATE TABLE IF NOT EXISTS highscores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    timestamp TEXT DEFAULT (datetime('now'))
  )
`)

export interface HighScore {
  id: number
  username: string
  score: number
  timestamp: string
}

export function getTopScores(limit = 10): HighScore[] {
  const stmt = db.prepare(`
    SELECT id, username, score, timestamp 
    FROM highscores 
    ORDER BY score DESC 
    LIMIT ?
  `)
  return stmt.all(limit) as HighScore[]
}

export function addScore(username: string, score: number): HighScore {
  const stmt = db.prepare(`
    INSERT INTO highscores (username, score) 
    VALUES (?, ?)
  `)
  const result = stmt.run(username, score)
  
  return {
    id: result.lastInsertRowid as number,
    username,
    score,
    timestamp: new Date().toISOString()
  }
}

export default db

