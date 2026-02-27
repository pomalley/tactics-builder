<script setup lang="ts">
import { armyState, addUnit, removeUnit, totalArmyPoints } from '../store'
import UnitItem from './UnitItem.vue'
</script>

<template>
  <div class="army-builder">
    <div class="army-header">
      <div class="header-left">
        <input type="text" v-model="armyState.name" class="army-name-input" placeholder="Army Name" />
        <div class="free-edit-toggle">
          <label>
            <input type="checkbox" v-model="armyState.freeEdit" />
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

    <button @click="addUnit" class="add-unit-btn">+ Add New Unit</button>
  </div>
</template>

<style scoped>
.army-builder {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

@media (prefers-color-scheme: dark) {
  .army-builder {
    background: #242424;
    box-shadow: 0 4px 6px rgba(0,0,0,0.5);
  }
}

.army-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #4CAF50;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 60%;
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
  font-size: 2rem;
  font-weight: 800;
  border: none;
  background: transparent;
  color: #333;
  width: 100%;
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
  font-size: 1.5rem;
  font-weight: bold;
}

.total-points {
  color: #4CAF50;
  font-size: 2rem;
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
