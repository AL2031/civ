import React, { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameUI from './components/GameUI'
import { initializeGame, processTurn } from './gameLogic'

function App() {
  const [gameState, setGameState] = useState(null)
  const [selectedTile, setSelectedTile] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    const initialGame = initializeGame()
    setGameState(initialGame)
  }, [])

  const handleTileClick = (tile) => {
    setSelectedTile(tile)
    if (tile.unit) {
      setSelectedUnit(tile.unit)
    } else {
      setSelectedUnit(null)
    }
  }

  const handleEndTurn = () => {
    if (gameState) {
      const newGameState = processTurn(gameState)
      setGameState(newGameState)
      setSelectedTile(null)
      setSelectedUnit(null)
    }
  }

  const handleBuildCity = () => {
    if (selectedTile && selectedUnit && selectedUnit.type === 'settler') {
      const newGameState = { ...gameState }
      
      // Create city
      const newCity = {
        id: `city-${Date.now()}`,
        name: `City ${newGameState.cities.length + 1}`,
        x: selectedTile.x,
        y: selectedTile.y,
        owner: selectedUnit.owner,
        population: 1,
        production: 0,
        currentProduction: null,
        buildings: []
      }
      
      newGameState.cities.push(newCity)
      
      // Remove settler
      newGameState.units = newGameState.units.filter(u => u.id !== selectedUnit.id)
      selectedTile.unit = null
      
      setGameState(newGameState)
      setSelectedUnit(null)
    }
  }

  const handleMoveUnit = (direction) => {
    if (!selectedUnit || !selectedTile) return
    
    const newGameState = { ...gameState }
    const unitIndex = newGameState.units.findIndex(u => u.id === selectedUnit.id)
    if (unitIndex === -1) return
    
    const unit = { ...newGameState.units[unitIndex] }
    let newX = unit.x
    let newY = unit.y
    
    switch (direction) {
      case 'up': newY--; break
      case 'down': newY++; break
      case 'left': newX--; break
      case 'right': newX++; break
      default: return
    }
    
    // Check bounds
    if (newX < 0 || newX >= gameState.mapSize || newY < 0 || newY >= gameState.mapSize) return
    
    // Check if tile has enemy unit
    const targetTile = gameState.tiles[newY][newX]
    if (targetTile.unit && targetTile.unit.owner !== unit.owner) return
    
    // Update unit position
    unit.x = newX
    unit.y = newY
    unit.movesLeft--
    
    newGameState.units[unitIndex] = unit
    
    // Update tiles
    newGameState.tiles[unit.y][unit.x].unit = unit
    newGameState.tiles[selectedTile.y][selectedTile.x].unit = null
    
    setGameState(newGameState)
    setSelectedTile(newGameState.tiles[newY][newX])
    setSelectedUnit(unit)
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Civilization Game...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Civilization Game</h1>
        
        <div className="flex gap-4">
          <GameBoard
            gameState={gameState}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
          />
          
          <GameUI
            gameState={gameState}
            selectedTile={selectedTile}
            selectedUnit={selectedUnit}
            onEndTurn={handleEndTurn}
            onBuildCity={handleBuildCity}
            onMoveUnit={handleMoveUnit}
          />
        </div>
      </div>
    </div>
  )
}

export default App
