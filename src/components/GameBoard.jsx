import React from 'react'

function terrainColor(t) {
  switch (t) {
    case 'Plains':
      return 'var(--plains)'
    case 'Forest':
      return 'var(--forest)'
    case 'Desert':
      return 'var(--desert)'
    case 'Water':
      return 'var(--water)'
    case 'Mountain':
      return 'var(--mountain)'
    default:
      return '#ccc'
  }
}

export default function GameBoard({ map = [], size = 10, units = [], cities = [], onTileClick }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${size}, 40px)`,
    gridTemplateRows: `repeat(${size}, 40px)`
  }

  function renderTile(t) {
    const unit = units.find(u => u.x === t.x && u.y === t.y)
    const city = cities.find(c => c.x === t.x && c.y === t.y)
    return (
      <div
        key={`${t.x}-${t.y}`}
        className="tile"
        onClick={() => onTileClick(t.x, t.y)}
        style={{ background: terrainColor(t.terrain) }}
        title={`(${t.x},${t.y}) ${t.terrain}`}>
        {city && <div className="city">🏛️</div>}
        {unit && (
          <div className={`unit ${unit.civ.toLowerCase()}`}>
            {unit.type === 'Warrior' ? '⚔️' : unit.type === 'Settler' ? '🚶' : '❓'}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="board" style={gridStyle}>
      {map.map(t => renderTile(t))}
    </div>
  )
}
