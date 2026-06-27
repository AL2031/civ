import React, { useEffect, useState } from 'react'
import { generateMap, createInitialUnits, findTileIndex, isPassable } from './gameLogic'
import GameBoard from './components/GameBoard'
import GameUI from './components/GameUI'

const DEFAULT_SIZE = 10

export default function App() {
  const [map, setMap] = useState([])
  const [units, setUnits] = useState([])
  const [cities, setCities] = useState([])
  const [selected, setSelected] = useState(null) // {x,y}
  const [selectedUnitId, setSelectedUnitId] = useState(null)
  const [turn, setTurn] = useState('Rome')

  useEffect(() => {
    const saved = localStorage.getItem('civ-game')
    if (saved) {
      const parsed = JSON.parse(saved)
      setMap(parsed.map)
      setUnits(parsed.units)
      setCities(parsed.cities)
      setTurn(parsed.turn || 'Rome')
    } else {
      const m = generateMap(DEFAULT_SIZE)
      const u = createInitialUnits(m)
      setMap(m)
      setUnits(u)
      setCities([])
    }
  }, [])

  useEffect(() => {
    // simple persistence
    if (map.length) {
      localStorage.setItem(
        'civ-game',
        JSON.stringify({ map, units, cities, turn })
      )
    }
  }, [map, units, cities, turn])

  function saveGame() {
    localStorage.setItem('civ-game', JSON.stringify({ map, units, cities, turn }))
    alert('Game saved to localStorage')
  }

  function loadGame() {
    const saved = localStorage.getItem('civ-game')
    if (saved) {
      const parsed = JSON.parse(saved)
      setMap(parsed.map)
      setUnits(parsed.units)
      setCities(parsed.cities)
      setTurn(parsed.turn || 'Rome')
      alert('Game loaded')
    } else {
      alert('No saved game found')
    }
  }

  function onTileClick(x, y) {
    setSelected({ x, y })
    const unit = units.find(u => u.x === x && u.y === y)
    setSelectedUnitId(unit ? unit.id : null)
  }

  function moveSelectedUnit(dx, dy) {
    if (!selectedUnitId) return
    setUnits(prev => {
      const uIdx = prev.findIndex(u => u.id === selectedUnitId)
      if (uIdx === -1) return prev
      const unit = { ...prev[uIdx] }
      const nx = unit.x + dx
      const ny = unit.y + dy
      const idx = findTileIndex(map, nx, ny)
      if (idx === -1) return prev
      const tile = map[idx]
      if (!isPassable(tile)) return prev
      // cannot move onto other unit
      if (prev.some(p => p.x === nx && p.y === ny)) return prev
      unit.x = nx
      unit.y = ny
      const copy = [...prev]
      copy[uIdx] = unit
      return copy
    })
  }

  function buildCity() {
    if (!selectedUnitId) return
    const unit = units.find(u => u.id === selectedUnitId)
    if (!unit || unit.type !== 'Settler') return
    // create city at unit location and remove settler
    setCities(prev => [...prev, { x: unit.x, y: unit.y, civ: unit.civ, pop: 1 }])
    setUnits(prev => prev.filter(u => u.id !== unit.id))
    setSelectedUnitId(null)
  }

  function endTurn() {
    setTurn(prev => (prev === 'Rome' ? 'Egypt' : 'Rome'))
    // reset moves (not implemented per-unit for now)
    // simple AI for Egypt
    setTimeout(() => {
      if (turn === 'Rome') {
        // after switching to Egypt, let Egypt play
        runSimpleAI('Egypt')
      } else {
        runSimpleAI('Rome')
      }
    }, 200)
  }

  function runSimpleAI(civ) {
    // find first unit for civ and try to move randomly
    setUnits(prev => {
      const myUnits = prev.filter(u => u.civ === civ)
      if (!myUnits.length) return prev
      const rnd = myUnits[0]
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ]
      for (const [dx, dy] of dirs.sort(() => Math.random() - 0.5)) {
        const nx = rnd.x + dx
        const ny = rnd.y + dy
        const idx = findTileIndex(map, nx, ny)
        if (idx === -1) continue
        const tile = map[idx]
        if (!isPassable(tile)) continue
        if (prev.some(p => p.x === nx && p.y === ny)) continue
        // move this unit
        return prev.map(u => (u.id === rnd.id ? { ...u, x: nx, y: ny } : u))
      }
      return prev
    })
  }

  return (
    <div className="app-root">
      <h1 className="title">Civilization (mini)</h1>
      <div className="game-area">
        <GameBoard
          map={map}
          size={DEFAULT_SIZE}
          units={units}
          cities={cities}
          onTileClick={onTileClick}
        />
        <GameUI
          selected={selected}
          selectedUnit={units.find(u => u.id === selectedUnitId)}
          onMove={moveSelectedUnit}
          onBuildCity={buildCity}
          onEndTurn={endTurn}
          onSave={saveGame}
          onLoad={loadGame}
          turn={turn}
        />
      </div>
    </div>
  )
}
