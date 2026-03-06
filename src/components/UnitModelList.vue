<script setup lang="ts">
import type { Unit } from '../types';
import ModelItem from './ModelItem.vue';
import { armyState, addModelToUnit, removeModelFromUnit } from '../store';

defineProps<{
  unit: Unit;
}>();
</script>

<template>
  <div class="models-container">
    <h4 v-if="unit.models.length > 0">Models</h4>
    <div class="models-list">
      <ModelItem
        v-for="model in unit.models"
        :key="model.id"
        :model="model"
        :unitId="unit.id"
        @remove="removeModelFromUnit(unit.id, $event)"
      />
    </div>
    <button
      v-if="armyState.freeEdit"
      @click="addModelToUnit(unit.id)"
      class="btn btn-secondary add-model-btn"
    >
      + Add Model
    </button>
  </div>
</template>

<style scoped>
.models-container h4 {
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-muted);
}

.add-model-btn {
  margin-top: var(--space-sm);
  width: 100%;
}
</style>
