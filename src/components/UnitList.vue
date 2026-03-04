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
  <div class="army-builder card">
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
        <button @click="addArmy" class="btn btn-blue add-army-btn">+ New Army</button>
        <button @click="onRemoveArmy" class="btn btn-danger remove-army-btn" :disabled="appState.armies.length <= 1">Delete Army</button>
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

    <button @click="addUnit" class="btn btn-primary add-unit-btn">+ Add New Unit To Army</button>
  </div>
</template>

<style scoped>
.army-builder {
  border-radius: var(--radius-lg);
  width: 100%;
}

.army-management {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-card-alt);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

@media (min-width: 600px) {
  .army-management {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.army-selector-group {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: 1;
}

.army-selector-group label {
  font-weight: bold;
  white-space: nowrap;
}

.army-selector-group select {
  flex: 1;
  max-width: 300px;
}

.management-actions {
  display: flex;
  gap: var(--space-xs);
}

.army-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 3px solid var(--primary);
}

@media (min-width: 600px) {
  .army-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
  }
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
}

@media (min-width: 600px) {
  .header-left {
    width: 60%;
  }
}

.free-edit-toggle label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-weight: bold;
  color: var(--text-muted);
}

.army-name-input {
  font-size: 1.25rem;
  font-weight: 800;
  border: none;
  background: transparent;
  color: var(--text-main);
  width: 100%;
}

@media (min-width: 768px) {
  .army-name-input {
    font-size: 1.5rem;
  }
}

.army-name-input:focus {
  outline: none;
  border-bottom: 2px solid var(--primary);
}

.army-total {
  font-size: 1.1rem;
  font-weight: bold;
}

@media (min-width: 768px) {
  .army-total {
    font-size: 1.25rem;
  }
}

.total-points {
  color: var(--primary);
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .total-points {
    font-size: 1.5rem;
  }
}

.units-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.add-unit-btn {
  margin-top: calc(2 * var(--space-lg));
  width: 100%;
}
</style>

