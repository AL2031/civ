// Core game helpers and generators

export function generateMap(size = 10) {
  const tiles = []
  const types = [
    { t: 'Plains', p: 0.4 },
    { t: 'Forest', p: 0.2 },
    { t: 'Desert', p: 0.15 },
    { t: 'Water', p: 0.15 },
    { t: 'Mountain', p: 0.1 }
  ]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.random()
      let acc = 0
      let chosen = 'Plains'
      for (const tt of types) {
        acc += tt.p
        if (r <= acc) {
          chosen = tt.t
          break
        }
      }
      tiles.push({ x, y, terrain: chosen })
    }
  }
  // make corners water/accessible and add a few mountains
  tiles.forEach(t => {
    if ((t.x === 0 && t.y === 0) || (t.x === size - 1 && t.y === size - 1)) {
      t.terrain = 'Plains'
    }
    if (Math.random() < 0.02) t.terrain = 'Mountain'
  })
  return tiles
}

let idCounter = 1
function nextId() {
  return 'u' + idCounter++
}

export function createInitialUnits(map) {
  const size = Math.sqrt(map.length)
  const units = []
  // Rome in top-left
  units.push({ id: nextId(), type: 'Warrior', civ: 'Rome', x: 1, y: 1 })
  units.push({ id: nextId(), type: 'Settler', civ: 'Rome', x: 2, y: 1 })
  // Egypt in bottom-right
  units.push({ id: nextId(), type: 'Warrior', civ: 'Egypt', x: size - 2, y: size - 2 })
  units.push({ id: nextId(), type: 'Settler', civ: 'Egypt', x: size - 3, y: size - 2 })
  return units
}

export function findTileIndex(map, x, y) {
  return map.findIndex(t => t.x === x && t.y === y)
}

export function isPassable(tile) {
  if (!tile) return false
  return tile.terrain !== 'Mountain' && tile.terrain !== 'Water'
}
