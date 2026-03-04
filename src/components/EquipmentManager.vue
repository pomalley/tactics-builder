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
        <select @change="(e) => onAddSlot(slot as string, (e.target as HTMLSelectElement).value as EquipmentName)">
          <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
            <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === weapon">{{ name }} [{{ equipmentPoints[name] }}]</option>
          </optgroup>
        </select>
        <button @click="onRemoveSlot(slot as string)" class="btn btn-danger btn-mini mini-remove-btn" title="Remove Slot">×</button>
      </template>
      <template v-else>
        <span class="weapon-name">{{ weapon }}</span>
      </template>
      <span class="weapon-points points-text">[{{ equipmentPoints[weapon] || 0 }}]</span>
    </div>

    <div v-for="(item, index) in target.extras" :key="'extra-' + index" class="equipment-item">
      <span class="slot-name">+</span>
      <template v-if="armyState.freeEdit">
        <select @change="(e) => {
          onRemoveExtra(index);
          onAddExtra((e.target as HTMLSelectElement).value as EquipmentName);
        }">
          <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
            <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === item">{{ name }} [{{ equipmentPoints[name] }}]</option>
          </optgroup>
        </select>
        <button @click="onRemoveExtra(index)" class="btn btn-danger btn-mini mini-remove-btn" title="Remove Extra">×</button>
      </template>
      <template v-else>
        <span class="weapon-name">{{ item }}</span>
      </template>
      <span class="weapon-points points-text">[{{ equipmentPoints[item] || 0 }}]</span>
    </div>

    <div v-if="armyState.freeEdit" class="manual-add-controls">
      <button @click="addManualSlot" class="btn btn-primary add-manual-btn">+ Add Slot</button>
      <button @click="onAddExtra('None')" class="btn btn-primary add-manual-btn">+ Add Extra</button>
    </div>
  </div>
</template>

<style scoped>
.equipment-manager {
  margin-bottom: var(--space-sm);
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.95rem;
  margin-bottom: var(--space-xs);
}

.slot-name {
  font-weight: bold;
  text-transform: capitalize;
  min-width: 4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.weapon-name {
  font-weight: 500;
}

.weapon-points {
  font-size: 0.85rem;
}

.manual-add-controls {
  margin-top: var(--space-sm);
  display: flex;
  gap: var(--space-xs);
}
</style>
