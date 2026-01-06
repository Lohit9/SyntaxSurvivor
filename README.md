# 🐛 Syntax Survivor

A fast-paced typing game where you defend against falling "bugs" by typing programming keywords before they reach the bottom. Built as a monorepo with React frontend and Express backend.

![Game Screenshot](docs/gameplay.png)

## 🎮 How to Play

1. **Start the game** - Click "START GAME" on the title screen
2. **Type keywords** - As bugs fall from the top, type the programming keywords to destroy them
3. **Target enemies** - Type the first letter of a word to target that bug (highlighted in cyan)
4. **Complete words** - Matched letters turn green; finish the word to score points
5. **Don't miss!** - If a bug reaches the bottom, it's game over
6. **Score points** - Longer words = more points (word length × 10)

## 🚀 How to Run

### Prerequisites

- **Node.js** v18+ (v20+ recommended)
- **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SyntaxSurvivor.git
cd SyntaxSurvivor

# Install all dependencies (root, client, and server)
npm install
```

### Development

```bash
# Start both client and server concurrently
npm start
```

This will launch:
- **Client**: http://localhost:5173 (Vite dev server with HMR)
- **Server**: http://localhost:3000 (Express API with hot reload)

### Individual Commands

```bash
# Run only the client
npm run dev:client

# Run only the server
npm run dev:server

# Build both for production
npm run build
```

### Project Structure

```
SyntaxSurvivor/
├── package.json          # Root workspace configuration
├── client/               # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components (GameCanvas, HUD, etc.)
│   │   ├── hooks/        # Custom React hooks (useGameLoop, useGameEngine)
│   │   ├── game/         # Game logic (GameEngine.ts)
│   │   └── App.tsx       # Main application component
│   └── ...
├── server/               # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── index.ts      # Express server & API routes
│   │   └── db.ts         # SQLite database setup
│   └── data/             # SQLite database file (auto-created)
└── README.md
```

## 🏗️ Architecture Decisions

### Frontend: React + Vite + TypeScript

**Why React?**
- **Component-based architecture** - Natural fit for game UI elements (HUD, canvas, overlays)
- **State management** - React's useState/useCallback hooks handle game state cleanly
- **Ecosystem** - Rich library support and developer tooling
- **Hot Module Replacement** - Vite provides instant feedback during development

**Why Vite?**
- **Speed** - Near-instant dev server startup and lightning-fast HMR
- **Modern defaults** - Native ES modules, TypeScript support out of the box
- **Simplicity** - Minimal configuration compared to webpack

**Why TypeScript?**
- **Type safety** - Catches bugs at compile time (critical for game logic)
- **Self-documenting** - Interfaces like `Enemy`, `GameEngineState` clarify data structures
- **IDE support** - Excellent autocomplete and refactoring capabilities

### Backend: Node.js + Express + TypeScript

**Why Node.js?**
- **JavaScript everywhere** - Same language on frontend and backend reduces context switching
- **npm ecosystem** - Vast library of packages for rapid development
- **Async I/O** - Efficient handling of concurrent requests

**Why Express?**
- **Simplicity** - Minimal, unopinionated framework that's easy to understand
- **Flexibility** - Easy to add middleware (CORS, JSON parsing, error handling)
- **Maturity** - Battle-tested with excellent documentation and community support

### Database: SQLite with better-sqlite3

**Why SQLite?**
- **Zero configuration** - No separate database server to install or configure
- **File-based** - Database is a single file, easy to backup/reset
- **Perfect for prototypes** - Ideal for single-server applications and demos
- **Synchronous API** - `better-sqlite3` provides fast, synchronous operations

**Why better-sqlite3 over sqlite3?**
- **Performance** - 2-3x faster than the async `sqlite3` package
- **Synchronous** - Simpler code without callback/promise chains
- **TypeScript support** - Good type definitions included

### Monorepo: npm Workspaces

**Why a monorepo?**
- **Single install** - One `npm install` sets up everything
- **Shared tooling** - Common TypeScript version, consistent formatting
- **Atomic changes** - Frontend and backend changes in single commits
- **Simple deployment** - Easy to containerize or deploy together

## ⚖️ Trade-offs & Future Improvements

### What We Would Do Differently With More Time

#### 1. **WebSocket Integration for Multiplayer**
Currently, the game is single-player with a shared leaderboard. With more time:
- Add Socket.io for real-time communication
- Implement competitive multiplayer (race to type words)
- Add cooperative mode (players defend together)
- Real-time leaderboard updates without polling

#### 2. **User Authentication**
The current leaderboard is anonymous. Improvements would include:
- OAuth integration (Google, GitHub, Discord)
- User profiles with historical stats
- Personal best tracking
- Anti-cheat measures (server-side score validation)

#### 3. **Progressive Difficulty**
The game currently has fixed enemy speed. We could add:
- Difficulty levels (Easy/Medium/Hard)
- Progressive speed increase over time
- Special enemy types (faster, worth more points)
- Power-ups (slow time, clear screen, extra life)

#### 4. **Lives System**
Currently, one missed bug = game over. A lives system would:
- Give players 3 lives
- Add health bar visualization
- Allow recovery (bonus lives from combos)
- Create more forgiving gameplay

#### 5. **Sound & Visual Effects**
Missing audio/visual feedback:
- Typing sounds
- Word completion effects (particles, screen flash)
- Background music with intensity changes
- Enemy destruction animations

#### 6. **Production Database**
SQLite works for demos but for production:
- PostgreSQL or MySQL for horizontal scaling
- Connection pooling for concurrent users
- Database migrations with version control
- Proper indexing for leaderboard queries

#### 7. **Testing**
No automated tests currently. Would add:
- Unit tests for game logic (Jest)
- Component tests (React Testing Library)
- E2E tests (Playwright)
- API tests (Supertest)

#### 8. **Deployment & DevOps**
For production deployment:
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Environment configuration (.env files)
- Logging and monitoring (Sentry, DataDog)

#### 9. **Accessibility**
Current accessibility gaps:
- Screen reader support for game state
- Keyboard-only navigation
- High contrast mode
- Colorblind-friendly highlighting

#### 10. **Mobile Support**
Desktop-only currently. Mobile would need:
- Touch-friendly virtual keyboard
- Responsive canvas sizing
- Mobile-optimized UI
- Touch gesture support

## 📝 API Reference

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/scores
Retrieve top 10 high scores.

**Response:**
```json
{
  "scores": [
    { "id": 1, "username": "Player1", "score": 1500, "timestamp": "..." }
  ]
}
```

### POST /api/scores
Submit a new high score.

**Request:**
```json
{
  "username": "PlayerName",
  "score": 1500
}
```

**Response:**
```json
{
  "message": "Score added successfully",
  "added": { "id": 4, "username": "PlayerName", "score": 1500, "timestamp": "..." },
  "scores": [...]
}
```

## 📄 License

MIT License - feel free to use this project for learning or as a starter template.

---

Built with ❤️ using React, Express, SQLite, and a lot of TypeScript.
