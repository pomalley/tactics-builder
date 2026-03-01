<script setup lang="ts">
import { 
  appState, 
  armyState, 
  addUnit, 
  removeUnit, 
  totalArmyPoints, 
  addArmy, 
  selectArmy, 
  removeArmy, 
  updateArmyName,
  setFreeEdit
} from '../store'
import UnitItem from './UnitItem.vue'

const onArmySelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectArmy(target.value);
};

const onRemoveArmy = () => {
  if (confirm(`Are you sure you want to delete "${armyState.name}"?`)) {
    removeArmy(armyState.id);
  }
};
</script>

<template>
  <div class="army-builder">
    <div class="army-management">
      <div class="army-selector-group">
        <label for="army-select">Current Army:</label>
        <select id="army-select" :value="armyState.id" @change="onArmySelect">
          <option v-for="army in appState.armies" :key="army.id" :value="army.id">
            {{ army.name }}
          </option>
        </select>
      </div>
      <div class="management-actions">
        <button @click="addArmy" class="mgmt-btn add-army-btn">+ New Army</button>
        <button @click="onRemoveArmy" class="mgmt-btn remove-army-btn" :disabled="appState.armies.length <= 1">Delete Army</button>
      </div>
    </div>

    <div class="army-header">
      <div class="header-left">
        <input 
          type="text" 
          :value="armyState.name" 
          @input="(e) => updateArmyName(armyState.id, (e.target as HTMLInputElement).value)"
          class="army-name-input" 
          placeholder="Army Name" 
        />
        <div class="free-edit-toggle">
          <label>
            <input type="checkbox" :checked="armyState.freeEdit" @change="(e) => setFreeEdit((e.target as HTMLInputElement).checked)" />
            Free Edit Mode
          </label>
        </div>
      </div>
      <div class="army-total">
        Total: <span class="total-points">{{ totalArmyPoints }} pts</span>
      </div>
    </div>

    <div class="units-list">
      <UnitItem 
        v-for="unit in armyState.units" 
        :key="unit.id" 
        :unit="unit" 
        @remove="removeUnit"
      />
    </div>

    <button @click="addUnit" class="add-unit-btn">+ Add New Unit To Army</button>
  </div>
</template>

<style scoped>
.army-builder {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .army-builder {
    padding: 2rem;
  }
}

@media (prefers-color-scheme: dark) {
  .army-builder {
    background: #242424;
    box-shadow: 0 4px 6px rgba(0,0,0,0.5);
  }
}

.army-management {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

@media (min-width: 600px) {
  .army-management {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

@media (prefers-color-scheme: dark) {
  .army-management {
    background: #1a1a1a;
    border-color: #333;
  }
}

.army-selector-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.army-selector-group label {
  font-weight: bold;
  white-space: nowrap;
}

.army-selector-group select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  flex: 1;
  max-width: 300px;
}

@media (prefers-color-scheme: dark) {
  .army-selector-group select {
    background: #333;
    color: white;
    border-color: #555;
  }
}

.management-actions {
  display: flex;
  gap: 0.5rem;
}

.mgmt-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.add-army-btn {
  background: #2196F3;
  color: white;
}

.add-army-btn:hover {
  background: #1976D2;
}

.remove-army-btn {
  background: #f44336;
  color: white;
}

.remove-army-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.remove-army-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.army-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #4CAF50;
}

@media (min-width: 600px) {
  .army-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 600px) {
  .header-left {
    width: 60%;
  }
}

.free-edit-toggle {
  display: flex;
  align-items: center;
}

.free-edit-toggle label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .free-edit-toggle label {
    color: #aaa;
  }
}

.army-name-input {
  font-size: 1.5rem;
  font-weight: 800;
  border: none;
  background: transparent;
  color: #333;
  width: 100%;
}

@media (min-width: 768px) {
  .army-name-input {
    font-size: 2rem;
  }
}

@media (prefers-color-scheme: dark) {
  .army-name-input {
    color: #eee;
  }
}

.army-name-input:focus {
  outline: none;
  border-bottom: 2px solid #4CAF50;
}

.army-total {
  font-size: 1.25rem;
  font-weight: bold;
}

@media (min-width: 768px) {
  .army-total {
    font-size: 1.5rem;
  }
}

.total-points {
  color: #4CAF50;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .total-points {
    font-size: 2rem;
  }
}

.units-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-unit-btn {
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-unit-btn:hover {
  background-color: #45a049;
}
</style>

