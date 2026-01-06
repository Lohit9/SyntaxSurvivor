// Word list for enemies to display
const WORDS = [
  'function', 'const', 'let', 'var', 'return', 'async', 'await',
  'import', 'export', 'class', 'interface', 'type', 'enum',
  'if', 'else', 'for', 'while', 'switch', 'case', 'break',
  'try', 'catch', 'throw', 'finally', 'new', 'this', 'super',
  'extends', 'implements', 'static', 'public', 'private', 'protected',
  'readonly', 'abstract', 'override', 'declare', 'module', 'namespace',
  'require', 'default', 'from', 'as', 'typeof', 'instanceof', 'void',
  'null', 'undefined', 'true', 'false', 'number', 'string', 'boolean'
]

export type GameState = 'idle' | 'playing' | 'game-over'

export interface Enemy {
  id: string
  x: number
  y: number
  word: string
  speed: number
}

export interface GameEngineState {
  enemies: Enemy[]
  playerInput: string
  gameState: GameState
  score: number
}

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const ENEMY_SPAWN_INTERVAL = 2000 // 2 seconds
const BASE_SPEED = 0.03 // pixels per millisecond
const SPEED_VARIANCE = 0.02

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function getRandomX(): number {
  // Leave some padding on the sides for the word to fit
  const padding = 100
  return padding + Math.random() * (GAME_WIDTH - padding * 2)
}

function getRandomSpeed(): number {
  return BASE_SPEED + (Math.random() * SPEED_VARIANCE * 2 - SPEED_VARIANCE)
}

export function createInitialState(): GameEngineState {
  return {
    enemies: [],
    playerInput: '',
    gameState: 'idle',
    score: 0
  }
}

export function spawnEnemy(state: GameEngineState): GameEngineState {
  const newEnemy: Enemy = {
    id: generateId(),
    x: getRandomX(),
    y: 0,
    word: getRandomWord(),
    speed: getRandomSpeed()
  }

  return {
    ...state,
    enemies: [...state.enemies, newEnemy]
  }
}

export function updateEnemies(state: GameEngineState, deltaTime: number): GameEngineState {
  let gameOver = false

  const updatedEnemies = state.enemies.map(enemy => {
    const newY = enemy.y + enemy.speed * deltaTime
    
    // Check if enemy hit the bottom
    if (newY > GAME_HEIGHT) {
      gameOver = true
    }

    return {
      ...enemy,
      y: newY
    }
  })

  if (gameOver) {
    return {
      ...state,
      enemies: updatedEnemies,
      gameState: 'game-over'
    }
  }

  return {
    ...state,
    enemies: updatedEnemies
  }
}

export function setPlayerInput(state: GameEngineState, input: string): GameEngineState {
  return {
    ...state,
    playerInput: input.toLowerCase()
  }
}

export function checkWordMatch(state: GameEngineState): GameEngineState {
  const input = state.playerInput.trim().toLowerCase()
  
  if (!input) {
    return state
  }

  // Find enemy with matching word
  const matchIndex = state.enemies.findIndex(
    enemy => enemy.word.toLowerCase() === input
  )

  if (matchIndex === -1) {
    return state
  }

  // Remove the matched enemy and increase score
  const matchedEnemy = state.enemies[matchIndex]
  const scoreIncrease = matchedEnemy.word.length * 10

  return {
    ...state,
    enemies: state.enemies.filter((_, index) => index !== matchIndex),
    playerInput: '',
    score: state.score + scoreIncrease
  }
}

export function startGame(state: GameEngineState): GameEngineState {
  return {
    ...createInitialState(),
    gameState: 'playing'
  }
}

export function endGame(state: GameEngineState): GameEngineState {
  return {
    ...state,
    gameState: 'game-over'
  }
}

export function resetGame(): GameEngineState {
  return createInitialState()
}

