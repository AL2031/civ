// Tile types with properties
const TILE_TYPES = {
  plains: { color: '#90EE90', food: 2, production: 1, gold: 0 },
  forest: { color: '#228B22', food: 1, production: 2, gold: 0 },
  desert: { color: '#F4A460', food: 0, production: 1, gold: 1 },
  water: { color: '#4169E1', food: 1, production: 0, gold: 2 },
  mountain: { color: '#808080', food: 0, production: 2, gold: 0 }
}

// Unit types
const UNIT_TYPES = {
  warrior: { attack: 2, defense: 2, moves: 2, cost: 20 },
  settler: { attack: 0, defense: 1, moves: 2, cost: 40 },
  scout: { attack: 1, defense: 1, moves: 3, cost: 15 }
}

// Building types
const BUILDING_TYPES = {
  monument: { cost: 30, culture: 2 },
  granary: { cost: 40, food: 2 },
  barracks: { cost: 50, attack: 1 }
}

// Initialize a new game
export function initializeGame() {
  const mapSize = 10
  const tiles = []
  
  // Generate map
  for (let y = 0; y < mapSize; y++) {
    const row = []
    for (let x = 0; x < mapSize; x++) {
      const rand = Math.random()
      let type
      if (rand < 0.4) type = 'plains'
      else if (rand < 0.6) type = 'forest'
      else if (rand < 0.75) type = 'desert'
      else if (rand < 0.85) type = 'water'
      else type = 'mountain'
      
      row.push({
        x,
        y,
        type,
        ...TILE_TYPES[type],
        unit: null,
        city: null
      })
    }
    tiles.push(row)
  }
  
  // Create civilizations
  const civilizations = [
    { id: 'civ1', name: 'Rome', color: '#DC143C', gold: 50, culture: 0 },
    { id: 'civ2', name: 'Egypt', color: '#FFD700', gold: 50, culture: 0 }
  ]
  
  // Create starting units
  const units = [
    { id: 'unit1', type: 'settler', owner: 'civ1', x: 1, y: 1, movesLeft: 2, ...UNIT_TYPES.settler },
    { id: 'unit2', type: 'warrior', owner: 'civ1', x: 2, y: 1, movesLeft: 2, ...UNIT_TYPES.warrior },
    { id: 'unit3', type: 'settler', owner: 'civ2', x: 8, y: 8, movesLeft: 2, ...UNIT_TYPES.settler },
    { id: 'unit4', type: 'warrior', owner: 'civ2', x: 7, y: 8, movesLeft: 2, ...UNIT_TYPES.warrior }
  ]
  
  // Place units on tiles
  units.forEach(unit => {
    tiles[unit.y][unit.x].unit = unit
  })
  
  return {
    mapSize,
    tiles,
    civilizations,
    units,
    cities: [],
    currentTurn: 1,
    currentPlayer: 'civ1',
    gameOver: false
  }
}

// Process a turn
export function processTurn(gameState) {
  const newGameState = { ...gameState }
  
  // Reset unit moves
  newGameState.units = newGameState.units.map(unit => ({
    ...unit,
    movesLeft: UNIT_TYPES[unit.type].moves
  }))
  
  // Process cities
  newGameState.cities = newGameState.cities.map(city => {
    const tile = newGameState.tiles[city.y][city.x]
    let food = tile.food
    let production = tile.production
    
    // Add food for population growth
    if (food >= 2 && city.population < 10) {
      city.population++
    }
    
    // Add production
    city.production += production
    
    // Check if production complete
    if (city.currentProduction && city.production >= city.currentProduction.cost) {
      city.production -= city.currentProduction.cost
      
      // Produce unit or building
      if (city.currentProduction.type === 'unit') {
        const newUnit = {
          id: `unit-${Date.now()}`,
          type: city.currentProduction.name,
          owner: city.owner,
          x: city.x,
          y: city.y,
          movesLeft: UNIT_TYPES[city.currentProduction.name].moves,
          ...UNIT_TYPES[city.currentProduction.name]
        }
        newGameState.units.push(newUnit)
        newGameState.tiles[city.y][city.x].unit = newUnit
      } else if (city.currentProduction.type === 'building') {
        city.buildings.push(city.currentProduction.name)
      }
      
      city.currentProduction = null
    }
    
    // Add gold to civilization
    const civIndex = newGameState.civilizations.findIndex(c => c.id === city.owner)
    if (civIndex !== -1) {
      newGameState.civilizations[civIndex].gold += tile.gold
    }
    
    return city
  })
  
  // Switch player
  newGameState.currentPlayer = newGameState.currentPlayer === 'civ1' ? 'civ2' : 'civ1'
  
  // Increment turn if back to first player
  if (newGameState.currentPlayer === 'civ1') {
    newGameState.currentTurn++
  }
  
  return newGameState
}

// Get valid moves for a unit
export function getValidMoves(gameState, unit) {
  const moves = []
  const directions = [
    { dx: 0, dy: -1 },  // up
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 0 },  // left
    { dx: 1, dy: 0 }    // right
  ]
  
  directions.forEach(dir => {
    const newX = unit.x + dir.dx
    const newY = unit.y + dir.dy
    
    if (newX >= 0 && newX < gameState.mapSize && newY >= 0 && newY < gameState.mapSize) {
      const targetTile = gameState.tiles[newY][newX]
      
      // Can move if no unit or unit is friendly
      if (!targetTile.unit || targetTile.unit.owner === unit.owner) {
        moves.push({ x: newX, y: newY })
      }
    }
  })
  
  return moves
}
