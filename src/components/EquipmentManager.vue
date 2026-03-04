<script setup lang="ts">
import { EquipmentName, equipmentPoints, equipmentGroups } from "../data/equipment";
import { armyState } from "../store";
import { formatSlotName } from "../utils";

const props = defineProps<{
  target: { slots: Record<string, EquipmentName>, extras: EquipmentName[] };
  onAddSlot: (name: string, weapon: EquipmentName) => void;
  onRemoveSlot: (name: string) => void;
  onAddExtra: (item: EquipmentName) => void;
  onRemoveExtra: (index: number) => void;
}>();

const addManualSlot = () => {
  const name = window.prompt("Slot Name (e.g. turret, sidearm, etc.):");
  if (name) props.onAddSlot(name, "None");
};
</script>

<template>
  <div class="equipment-manager" v-if="Object.keys(target.slots).length > 0 || target.extras.length > 0 || armyState.freeEdit">
    <div v-for="(weapon, slot) in target.slots" :key="slot" class="equipment-item">
      <span class="slot-name">{{ formatSlotName(slot as string) }}:</span>
      <template v-if="armyState.freeEdit">
        <select @change="(e) => onAddSlot(slot as string, (e.target as HTMLSelectElement).value as EquipmentName)" class="mini-select">
          <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
            <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === weapon">{{ name }} [{{ equipmentPoints[name] }}]</option>
          </optgroup>
        </select>
        <button @click="onRemoveSlot(slot as string)" class="mini-remove-btn" title="Remove Slot">×</button>
      </template>
      <template v-else>
        <span class="weapon-name">{{ weapon }}</span>
      </template>
      <span class="weapon-points">[{{ equipmentPoints[weapon] || 0 }}]</span>
    </div>

    <div v-for="(item, index) in target.extras" :key="'extra-' + index" class="equipment-item">
      <span class="slot-name">+</span>
      <template v-if="armyState.freeEdit">
        <select @change="(e) => {
          onRemoveExtra(index);
          onAddExtra((e.target as HTMLSelectElement).value as EquipmentName);
        }" class="mini-select">
          <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
            <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === item">{{ name }} [{{ equipmentPoints[name] }}]</option>
          </optgroup>
        </select>
        <button @click="onRemoveExtra(index)" class="mini-remove-btn" title="Remove Extra">×</button>
      </template>
      <template v-else>
        <span class="weapon-name">{{ item }}</span>
      </template>
      <span class="weapon-points">[{{ equipmentPoints[item] || 0 }}]</span>
    </div>

    <div v-if="armyState.freeEdit" class="manual-add-controls">
      <button @click="addManualSlot" class="add-manual-btn">+ Add Slot</button>
      <button @click="onAddExtra('None')" class="add-manual-btn">+ Add Extra</button>
    </div>
  </div>
</template>

<style scoped>
.equipment-manager {
  margin-bottom: 0.5rem;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.slot-name {
  font-weight: bold;
  text-transform: capitalize;
  min-width: 4rem;
  font-size: 0.8rem;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .slot-name {
    color: #aaa;
  }
}

.weapon-name {
  font-weight: 500;
}

.weapon-points {
  color: #4caf50;
  font-size: 0.85rem;
  font-weight: bold;
}

.mini-select {
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .mini-select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.mini-remove-btn {
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1rem;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manual-add-controls {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.35rem;
}

.add-manual-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
}

.add-manual-btn:hover {
  background: #45a049;
}
</style>
