import React from 'react'

function GameBoard({ gameState, selectedTile, onTileClick }) {
  if (!gameState) return null

  return (
    <div className="flex-1">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gameState.mapSize}, 1fr)`,
          maxWidth: '600px'
        }}
      >
        {gameState.tiles.map((row, y) =>
          row.map((tile, x) => {
            const isSelected = selectedTile && selectedTile.x === x && selectedTile.y === y
            const hasCity = gameState.cities.find(c => c.x === x && c.y === y)
            
            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onTileClick(tile)}
                className={`
                  aspect-square rounded cursor-pointer transition-all
                  flex items-center justify-center text-xs font-bold
                  ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
                  ${tile.type === 'water' ? 'hover:scale-100' : ''}
                `}
                style={{
                  backgroundColor: tile.color,
                  border: hasCity ? '3px solid gold' : '1px solid rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  {hasCity && (
                    <span className="text-lg">🏛️</span>
                  )}
                  {tile.unit && (
                    <span 
                      className="text-lg"
                      style={{ 
                        filter: `drop-shadow(0 0 2px ${gameState.civilizations.find(c => c.id === tile.unit.owner)?.color})` 
                      }}
                    >
                      {getUnitIcon(tile.unit.type)}
                    </span>
                  )}
                  {!tile.unit && !hasCity && getTerrainIcon(tile.type)}
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: TILE_COLORS.plains }}></span>
          <span>Plains</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: TILE_COLORS.forest }}></span>
          <span>Forest</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: TILE_COLORS.desert }}></span>
          <span>Desert</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: TILE_COLORS.water }}></span>
          <span>Water</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded" style={{ backgroundColor: TILE_COLORS.mountain }}></span>
          <span>Mountain</span>
        </div>
      </div>
    </div>
  )
}

const TILE_COLORS = {
  plains: '#90EE90',
  forest: '#228B22',
  desert: '#F4A460',
  water: '#4169E1',
  mountain: '#808080'
}

function getTerrainIcon(type) {
  switch (type) {
    case 'forest': return '🌲'
    case 'mountain': return '⛰️'
    case 'water': return '🌊'
    case 'desert': return '🏜️'
    default: return ''
  }
}

function getUnitIcon(type) {
  switch (type) {
    case 'warrior': return '⚔️'
    case 'settler': return '🚶'
    case 'scout': return '🐎'
    default: return '❓'
  }
}

export default GameBoard
