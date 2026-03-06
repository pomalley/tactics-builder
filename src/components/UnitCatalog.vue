<script setup lang="ts">
import { unitGroups } from '../data/units';
import { addUnitWithType } from '../store';

const onAddUnit = (type: string) => {
  addUnitWithType(type as any);
};
</script>

<template>
  <div class="unit-catalog card">
    <h2>Available Units</h2>
    <div class="catalog-content">
      <div v-for="group in unitGroups" :key="group.label" class="catalog-group">
        <h3>{{ group.label }}</h3>
        <div class="unit-buttons">
          <button
            v-for="type in group.types"
            :key="type"
            class="btn btn-secondary add-type-btn"
            @click="onAddUnit(type)"
            title="Add this unit to your army"
          >
            + {{ type }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unit-catalog {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.unit-catalog h2 {
  margin: 0 0 var(--space-md) 0;
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--border-color);
  font-size: 1.25rem;
}

.catalog-content {
  flex: 1;
  overflow-y: auto;
  padding-right: var(--space-sm);
  /* Allows scrollbar without shifting content too much if we customize it */
}

.catalog-group h3 {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 0 var(--space-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.unit-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.add-type-btn {
  text-align: left;
  justify-content: flex-start;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.95rem;
  transition:
    transform 0.1s ease,
    background-color 0.2s;
}

.add-type-btn:hover {
  transform: translateX(4px);
}
</style>
