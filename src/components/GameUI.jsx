import React from 'react'

export default function GameUI({ selected, selectedUnit, onMove, onBuildCity, onEndTurn, onSave, onLoad, turn }) {
  return (
    <div className="game-ui">
      <div className="turn">Turn: <strong>{turn}</strong></div>
      <div className="selected">
        <h3>Selected Tile</h3>
        {selected ? (
          <div>{`x: ${selected.x}, y: ${selected.y}`}</div>
        ) : (
          <div>None</div>
        )}
      </div>

      <div className="unit-controls">
        <h3>Unit</h3>
        {selectedUnit ? (
          <div>
            <div>{selectedUnit.type} ({selectedUnit.civ})</div>
            <div className="move-buttons">
              <button onClick={() => onMove(0, -1)}>↑</button>
              <div>
                <button onClick={() => onMove(-1, 0)}>←</button>
                <button onClick={() => onMove(1, 0)}>→</button>
              </div>
              <button onClick={() => onMove(0, 1)}>↓</button>
            </div>
            {selectedUnit.type === 'Settler' && (
              <button onClick={onBuildCity}>Build City</button>
            )}
          </div>
        ) : (
          <div>No unit selected</div>
        )}
      </div>

      <div className="controls">
        <button onClick={onEndTurn}>End Turn</button>
        <button onClick={onSave}>Save</button>
        <button onClick={onLoad}>Load</button>
      </div>

      <div className="help">
        Click a tile to select it. Click a unit to control it. Settlerrs can build cities.
      </div>
    </div>
  )
}
