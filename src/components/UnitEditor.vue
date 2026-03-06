<script setup lang="ts">
import type { UnitType } from '../types';
import { lifeformStats, type Lifeform } from '../data/lifeforms';
import { unitGroups } from '../data/units';
import { useCurrentUnit } from '../composables/useCurrentUnit';
import {
  changeUnitType,
  changeUnitLifeform,
  addSlotToUnit,
  removeSlotFromUnit,
  addExtraToUnit,
  removeExtraFromUnit,
} from '../store';

import EquipmentManager from './EquipmentManager.vue';
import UnitOptionsEditor from './UnitOptionsEditor.vue';
import UnitModelList from './UnitModelList.vue';

const { unit, unitPoints } = useCurrentUnit();

const lifeformTypes = Object.keys(lifeformStats) as Lifeform[];

const onTypeChange = (event: Event) => {
  if (!unit.value) return;
  const target = event.target as HTMLSelectElement;
  changeUnitType(unit.value.id, target.value as UnitType);
};

const onLifeformChange = (event: Event) => {
  if (!unit.value) return;
  const target = event.target as HTMLSelectElement;
  changeUnitLifeform(unit.value.id, target.value as Lifeform);
};
</script>

<template>
  <div v-if="unit" class="unit-editor card">
    <div class="unit-header">
      <div class="header-main">
        <input
          type="text"
          v-model="unit.name"
          class="input-header unit-name-input"
          placeholder="Unit Name"
        />
        <span class="unit-points points-text">{{ unitPoints }} pts</span>
      </div>
    </div>

    <div class="unit-body">
      <div class="unit-settings">
        <div class="setting-group">
          <label>Type:</label>
          <select :value="unit.type" @change="onTypeChange">
            <optgroup v-for="group in unitGroups" :key="group.label" :label="group.label">
              <option v-for="type in group.types" :key="type" :value="type">
                {{ type }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="setting-group" v-if="unit.lifeform !== undefined">
          <label>Lifeform:</label>
          <select :value="unit.lifeform" @change="onLifeformChange">
            <option v-for="lf in lifeformTypes" :key="lf" :value="lf">
              {{ lf }}
            </option>
          </select>
        </div>
      </div>

      <UnitOptionsEditor :unit="unit" />

      <div class="unit-equipment-container">
        <EquipmentManager
          :target="unit"
          @add-slot="(name, weapon) => addSlotToUnit(unit!.id, name, weapon)"
          @remove-slot="(name) => removeSlotFromUnit(unit!.id, name)"
          @add-extra="(item) => addExtraToUnit(unit!.id, item)"
          @remove-extra="(index) => removeExtraFromUnit(unit!.id, index)"
        />
      </div>

      <UnitModelList :unit="unit" />
    </div>
  </div>
</template>

<style scoped>
.unit-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.unit-header {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-color);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.unit-name-input {
  font-size: 1.25rem;
  flex: 1;
}

.unit-points {
  font-size: 1.25rem;
  color: var(--primary);
  font-weight: bold;
}

.unit-settings {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.setting-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.setting-group label {
  font-weight: bold;
  color: var(--text-muted);
}

.unit-equipment-container {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.unit-equipment-container h4 {
  margin: 0 0 var(--space-md) 0;
  color: var(--text-muted);
}
</style>
