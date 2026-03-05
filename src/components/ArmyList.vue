<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { 
  appState, 
  armyState, 
  removeUnit, 
  totalArmyPoints, 
  updateArmyName,
  updateArmyDefaultLifeform,
  selectUnit,
  moveUnit,
  updateUnitsOrder,
  calculateUnitPoints
} from '../store'
import { lifeforms } from '../data/lifeforms'

const getUnitPoints = (unit: any) => calculateUnitPoints(unit);

const draggableUnits = computed({
  get: () => armyState.units,
  set: (value) => updateUnitsOrder(value)
})
</script>

<template>
  <div class="army-list card">


    <div class="army-header">
      <div class="army-name-row">
        <input 
          type="text" 
          :value="armyState.name" 
          @input="(e) => updateArmyName(armyState.id, (e.target as HTMLInputElement).value)"
          class="input-header army-name-input" 
          placeholder="Army Name" 
        />
        <select 
          :value="armyState.defaultLifeform"
          @change="(e) => updateArmyDefaultLifeform(armyState.id, (e.target as HTMLSelectElement).value as any)"
          class="lifeform-select"
        >
          <option v-for="lf in lifeforms" :key="lf" :value="lf">{{ lf }}</option>
        </select>
      </div>
      <div class="army-total">
        <span class="total-points">{{ totalArmyPoints }} pts</span>
      </div>
    </div>

    <draggable 
      v-model="draggableUnits" 
      item-key="id"
      handle=".drag-handle"
      class="units-list"
      ghost-class="ghost"
    >
      <template #item="{ element: unit, index }">
        <div 
          class="unit-summary-card"
          :class="{ 'selected': appState.selectedUnitId === unit.id }"
          @click="selectUnit(unit.id)"
        >
          <div class="drag-handle" @click.stop title="Drag to reorder">⋮⋮</div>
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
      </template>
    </draggable>
    
    <div v-if="armyState.units.length === 0" class="empty-state">
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



.army-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.army-name-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.army-name-input {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 800;
}

.lifeform-select {
  padding: 4px 8px;
  font-size: 0.85rem;
  background: var(--bg-card-alt);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
}

.lifeform-select:focus {
  outline: none;
  border-color: var(--primary);
  color: var(--text-main);
}

.army-total {
  font-size: 1.1rem;
  font-weight: bold;
}

.total-points {
  color: var(--primary);
}

.total-points {
  color: var(--primary);
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

.drag-handle {
  padding: 0 var(--space-xs);
  cursor: grab;
  color: var(--text-muted);
  opacity: 0.5;
  font-size: 1.2rem;
  user-select: none;
}

.drag-handle:hover {
  opacity: 1;
  color: var(--primary);
}

.drag-handle:active {
  cursor: grabbing;
}

.ghost {
  opacity: 0.5;
  background: var(--bg-card-alt) !important;
  border: 1px dashed var(--primary) !important;
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

.delete-btn {
  color: var(--danger);
}

.delete-btn:hover {
  background: rgba(var(--danger-rgb), 0.1);
}
</style>
