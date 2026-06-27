import React from 'react'
import { Sword, User, MapPin, Coins, Building2, RotateCcw } from 'lucide-react'

function GameUI({ gameState, selectedTile, selectedUnit, onEndTurn, onBuildCity, onMoveUnit }) {
  if (!gameState) return null

  const currentPlayer = gameState.civilizations.find(c => c.id === gameState.currentPlayer)
  const selectedCity = selectedTile ? gameState.cities.find(c => c.x === selectedTile.x && c.y === selectedTile.y) : null

  return (
    <div className="w-80 flex flex-col gap-4">
      {/* Game Info */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-3">Game Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Turn:</span>
            <span className="font-bold">{gameState.currentTurn}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Current Player:</span>
            <span 
              className="font-bold px-2 py-1 rounded"
              style={{ backgroundColor: currentPlayer.color, color: getContrastColor(currentPlayer.color) }}
            >
              {currentPlayer.name}
            </span>
          </div>
        </div>
      </div>

      {/* Player Resources */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-3">Resources</h2>
        <div className="space-y-2 text-sm">
          {gameState.civilizations.map(civ => (
            <div 
              key={civ.id}
              className={`p-2 rounded ${civ.id === gameState.currentPlayer ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: civ.color + '40' }}
            >
              <div className="font-bold mb-1">{civ.name}</div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>{civ.gold} Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{gameState.cities.filter(c => c.owner === civ.id).length} Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                <span>{gameState.units.filter(u => u.owner === civ.id).length} Units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Tile Info */}
      {selectedTile && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">Selected Tile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{selectedTile.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Food:</span>
              <span>{selectedTile.food}</span>
            </div>
            <div className="flex justify-between">
              <span>Production:</span>
              <span>{selectedTile.production}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold:</span>
              <span>{selectedTile.gold}</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Unit Info */}
      {selectedUnit && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">Selected Unit</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{selectedUnit.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Owner:</span>
              <span>{gameState.civilizations.find(c => c.id === selectedUnit.owner)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Moves Left:</span>
              <span>{selectedUnit.movesLeft}</span>
            </div>
            <div className="flex justify-between">
              <span>Attack:</span>
              <span>{selectedUnit.attack}</span>
            </div>
            <div className="flex justify-between">
              <span>Defense:</span>
              <span>{selectedUnit.defense}</span>
            </div>
            
            {/* Movement Controls */}
            {selectedUnit.owner === gameState.currentPlayer && selectedUnit.movesLeft > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs mb-2 text-gray-400">Move Unit</div>
                <div className="grid grid-cols-3 gap-1">
                  <div></div>
                  <button 
                    onClick={() => onMoveUnit('up')}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
                  >
                    ↑
                  </button>
                  <div></div>
                  <button 
                    onClick={() => onMoveUnit('left')}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
                  >
                    ←
                  </button>
                  <div></div>
                  <button 
                    onClick={() => onMoveUnit('right')}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
                  >
                    →
                  </button>
                  <div></div>
                  <button 
                    onClick={() => onMoveUnit('down')}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
                  >
                    ↓
                  </button>
                  <div></div>
                </div>
              </div>
            )}
            
            {/* Build City Button */}
            {selectedUnit.type === 'settler' && selectedUnit.owner === gameState.currentPlayer && (
              <button
                onClick={onBuildCity}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Build City
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selected City Info */}
      {selectedCity && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">City Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{selectedCity.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Population:</span>
              <span>{selectedCity.population}</span>
            </div>
            <div className="flex justify-between">
              <span>Production:</span>
              <span>{selectedCity.production}</span>
            </div>
            <div className="flex justify-between">
              <span>Buildings:</span>
              <span>{selectedCity.buildings.length}</span>
            </div>
            {selectedCity.currentProduction && (
              <div className="flex justify-between">
                <span>Producing:</span>
                <span className="capitalize">{selectedCity.currentProduction.name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* End Turn Button */}
      <button
        onClick={onEndTurn}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-bold"
      >
        <RotateCcw className="w-5 h-5" />
        End Turn
      </button>
    </div>
  )
}

function getContrastColor(hexcolor) {
  const r = parseInt(hexcolor.slice(1, 3), 16)
  const g = parseInt(hexcolor.slice(3, 5), 16)
  const b = parseInt(hexcolor.slice(5, 7), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? 'black' : 'white'
}

export default GameUI
