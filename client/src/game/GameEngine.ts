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
  targetedEnemyId: string | null
  typedLetters: string // Letters typed so far for the targeted enemy
  gameState: GameState
  score: number
  isShaking: boolean // Visual shake effect for wrong letter
}

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const ENEMY_SPAWN_INTERVAL = 2000 // 2 seconds
export const SHAKE_DURATION = 150 // milliseconds
const BASE_SPEED = 0.08 // pixels per millisecond
const SPEED_VARIANCE = 0.03

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
    targetedEnemyId: null,
    typedLetters: '',
    gameState: 'idle',
    score: 0,
    isShaking: false
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
  let targetedEnemyId = state.targetedEnemyId

  const updatedEnemies = state.enemies
    .map(enemy => {
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
    .filter(enemy => {
      // Remove enemies that went off screen
      const isOffScreen = enemy.y > GAME_HEIGHT + 50
      if (isOffScreen && enemy.id === targetedEnemyId) {
        targetedEnemyId = null
      }
      return !isOffScreen
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
    enemies: updatedEnemies,
    targetedEnemyId
  }
}

export interface KeyPressResult {
  state: GameEngineState
  wasCorrect: boolean
  wordCompleted: boolean
}

export function handleKeyPress(state: GameEngineState, key: string): KeyPressResult {
  // Only handle single letters
  if (key.length !== 1 || !/^[a-zA-Z]$/.test(key)) {
    return { state, wasCorrect: false, wordCompleted: false }
  }

  const letter = key.toLowerCase()

  // If no enemy is targeted, try to find one that starts with this letter
  if (state.targetedEnemyId === null) {
    const matchingEnemy = state.enemies.find(
      enemy => enemy.word.toLowerCase().startsWith(letter)
    )

    if (matchingEnemy) {
      // Check if this completes a single-letter word
      if (matchingEnemy.word.length === 1) {
        const scoreIncrease = matchingEnemy.word.length * 10
        return {
          state: {
            ...state,
            enemies: state.enemies.filter(e => e.id !== matchingEnemy.id),
            targetedEnemyId: null,
            typedLetters: '',
            score: state.score + scoreIncrease,
            isShaking: false
          },
          wasCorrect: true,
          wordCompleted: true
        }
      }

      // Target this enemy
      return {
        state: {
          ...state,
          targetedEnemyId: matchingEnemy.id,
          typedLetters: letter,
          isShaking: false
        },
        wasCorrect: true,
        wordCompleted: false
      }
    }

    // No matching enemy found - wrong letter
    return {
      state: { ...state, isShaking: true },
      wasCorrect: false,
      wordCompleted: false
    }
  }

  // An enemy is already targeted - check if the next letter matches
  const targetedEnemy = state.enemies.find(e => e.id === state.targetedEnemyId)
  
  if (!targetedEnemy) {
    // Targeted enemy no longer exists, reset targeting
    return {
      state: {
        ...state,
        targetedEnemyId: null,
        typedLetters: '',
        isShaking: false
      },
      wasCorrect: false,
      wordCompleted: false
    }
  }

  const nextLetterIndex = state.typedLetters.length
  const expectedLetter = targetedEnemy.word.toLowerCase()[nextLetterIndex]

  if (letter === expectedLetter) {
    const newTypedLetters = state.typedLetters + letter

    // Check if word is fully typed
    if (newTypedLetters.length === targetedEnemy.word.length) {
      const scoreIncrease = targetedEnemy.word.length * 10
      return {
        state: {
          ...state,
          enemies: state.enemies.filter(e => e.id !== targetedEnemy.id),
          targetedEnemyId: null,
          typedLetters: '',
          score: state.score + scoreIncrease,
          isShaking: false
        },
        wasCorrect: true,
        wordCompleted: true
      }
    }

    // Word not complete yet
    return {
      state: {
        ...state,
        typedLetters: newTypedLetters,
        isShaking: false
      },
      wasCorrect: true,
      wordCompleted: false
    }
  }

  // Wrong letter - trigger shake
  return {
    state: { ...state, isShaking: true },
    wasCorrect: false,
    wordCompleted: false
  }
}

export function clearShake(state: GameEngineState): GameEngineState {
  return {
    ...state,
    isShaking: false
  }
}

export function startGame(_state: GameEngineState): GameEngineState {
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
