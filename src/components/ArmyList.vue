<script setup lang="ts">
import { 
  appState, 
  armyState, 
  removeUnit, 
  totalArmyPoints, 
  addArmy, 
  selectArmy, 
  removeArmy, 
  updateArmyName,
  setFreeEdit,
  selectUnit,
  moveUnit,
  calculateUnitPoints
} from '../store'

const onArmySelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectArmy(target.value);
};

const onRemoveArmy = () => {
  if (confirm(`Are you sure you want to delete "${armyState.name}"?`)) {
    removeArmy(armyState.id);
  }
};

const getUnitPoints = (unit: any) => calculateUnitPoints(unit);
</script>

<template>
  <div class="army-list card">
    <div class="army-management">
      <div class="army-selector-group">
        <select id="army-select" :value="armyState.id" @change="onArmySelect">
          <option v-for="army in appState.armies" :key="army.id" :value="army.id">
            {{ army.name }}
          </option>
        </select>
        <div class="management-actions">
          <button @click="addArmy" class="btn btn-blue" title="New Army">+</button>
          <button @click="onRemoveArmy" class="btn btn-danger" :disabled="appState.armies.length <= 1" title="Delete Army">🗑</button>
        </div>
      </div>
    </div>

    <div class="army-header">
      <input 
        type="text" 
        :value="armyState.name" 
        @input="(e) => updateArmyName(armyState.id, (e.target as HTMLInputElement).value)"
        class="army-name-input" 
        placeholder="Army Name" 
      />
      <div class="army-total">
        <span class="total-points">{{ totalArmyPoints }} pts</span>
      </div>
    </div>

    <div class="free-edit-toggle">
      <label>
        <input type="checkbox" :checked="armyState.freeEdit" @change="(e) => setFreeEdit((e.target as HTMLInputElement).checked)" />
        Free Edit Mode
      </label>
    </div>

    <div class="units-list">
      <div 
        v-for="(unit, index) in armyState.units" 
        :key="unit.id" 
        class="unit-summary-card"
        :class="{ 'selected': appState.selectedUnitId === unit.id }"
        @click="selectUnit(unit.id)"
      >
        <div class="unit-summary-main">
          <div class="unit-summary-name">{{ unit.name }}</div>
          <div class="unit-summary-details">{{ unit.type }} - {{ unit.lifeform }}</div>
        </div>
        <div class="unit-summary-actions">
          <span class="unit-summary-points">{{ getUnitPoints(unit) }} pts</span>
          <div class="action-buttons">
            <button @click.stop="moveUnit(unit.id, 'up')" :disabled="index === 0" class="btn btn-ghost move-btn" title="Move Up">↑</button>
            <button @click.stop="moveUnit(unit.id, 'down')" :disabled="index === armyState.units.length - 1" class="btn btn-ghost move-btn" title="Move Down">↓</button>
            <button @click.stop="removeUnit(unit.id)" class="btn btn-ghost delete-btn" title="Delete Unit">✕</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="armyState.units.length === 0" class="empty-roster">
      <p>Your army has no units.</p>
      <p class="text-muted">Select a unit from the catalog to add it to your roster.</p>
    </div>
  </div>
</template>

<style scoped>
.army-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.army-management {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-color);
}

.army-selector-group {
  display: flex;
  gap: var(--space-sm);
}

.army-selector-group select {
  flex: 1;
}

.management-actions {
  display: flex;
  gap: var(--space-xs);
}

.army-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.army-name-input {
  font-size: 1.25rem;
  font-weight: 800;
  border: none;
  background: transparent;
  color: var(--text-main);
  width: 100%;
  padding: 0;
}

.army-name-input:focus {
  outline: none;
  border-bottom: 2px solid var(--primary);
}

.army-total {
  font-size: 1.1rem;
  font-weight: bold;
}

.total-points {
  color: var(--primary);
}

.free-edit-toggle {
  margin-bottom: var(--space-lg);
}

.free-edit-toggle label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.units-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-xs);
}

.unit-summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s;
}

.unit-summary-card:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.unit-summary-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
  background: var(--bg-card);
}

.unit-summary-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.unit-summary-name {
  font-weight: bold;
  font-size: 1rem;
}

.unit-summary-details {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.unit-summary-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.unit-summary-points {
  font-weight: bold;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 2px;
}

@media (hover: hover) {
  .action-buttons {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .unit-summary-card:hover .action-buttons,
  .unit-summary-card.selected .action-buttons {
    visibility: visible;
    opacity: 1;
  }
}

.btn-ghost {
  padding: 2px 6px;
  font-size: 0.8rem;
  height: auto;
}

.delete-btn {
  color: var(--danger);
}

.delete-btn:hover {
  background: rgba(var(--danger-rgb), 0.1);
}

.empty-roster {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  opacity: 0.7;
}

.text-muted {
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
