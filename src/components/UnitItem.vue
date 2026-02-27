<script setup lang="ts">
import { computed } from "vue";
import type { Unit, UnitType, UnitOptionDef } from "../types";
import { equipmentPoints, equipmentGroups, type EquipmentName } from "../data/equipment";
import { lifeformClassPoints, type Lifeform } from "../data/lifeforms";
import { unitGroups, unitOptions } from "../data/units";
import ModelItem from "./ModelItem.vue";
import {
  armyState,
  addModelToUnit,
  removeModelFromUnit,
  calculateUnitPoints,
  changeUnitType,
  changeUnitLifeform,
  toggleUnitOption,
  selectUnitOptionChoice,
  addSlotToUnit,
  removeSlotFromUnit,
  addExtraToUnit,
  removeExtraFromUnit,
} from "../store";
import { formatSlotName } from "../utils";

const props = defineProps<{
  unit: Unit;
}>();

const lifeformTypes = Object.keys(lifeformClassPoints) as Lifeform[];

const addManualSlot = () => {
  const name = window.prompt("Slot Name (e.g. turret, sidearm):");
  if (name) addSlotToUnit(props.unit.id, name, "None");
};

const emit = defineEmits<{
  (e: "remove", unitId: string): void;
}>();

const unitPoints = computed(() => {
  return calculateUnitPoints(props.unit);
});

const availableOptions = computed(() => unitOptions[props.unit.type] || []);

const onTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  changeUnitType(props.unit.id, target.value as UnitType);
};

const onLifeformChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  changeUnitLifeform(props.unit.id, target.value as Lifeform);
};

const getOptionDefaultLabel = (opt: UnitOptionDef) => {
  // Check unit slots first
  if (opt.type === "slot" && opt.slotName && props.unit.slots[opt.slotName]) {
    const currentWeapon = props.unit.slots[opt.slotName];
    const points = equipmentPoints[currentWeapon as EquipmentName];
    const pointsLabel = points !== undefined ? ` [${points}]` : "";
    return `Default (${currentWeapon}${pointsLabel})`;
  }

  // If the first choice's first modification targets a slot, find the current value of that slot
  const firstMod = opt.choices?.[0]?.modifications?.[0];
  if (firstMod && (firstMod.setSlot || firstMod.clearSlot || firstMod.setUnitSlot || firstMod.clearUnitSlot)) {
    if (firstMod.setUnitSlot || firstMod.clearUnitSlot) {
        const slotName = firstMod.setUnitSlot ? Object.keys(firstMod.setUnitSlot)[0] : firstMod.clearUnitSlot!;
        const currentWeapon = props.unit.slots[slotName];
        if (currentWeapon) {
            const points = equipmentPoints[currentWeapon as EquipmentName];
            const pointsLabel = points !== undefined ? ` [${points}]` : "";
            return `Default (${currentWeapon}${pointsLabel})`;
        }
    }

    const slotName = firstMod.setSlot
      ? Object.keys(firstMod.setSlot)[0]
      : firstMod.clearSlot!;

    // Find a model this option targets
    const targetModel = props.unit.models.find((m) => {
      const nameMatch = !firstMod.targetName || m.name === firstMod.targetName;
      const classMatch =
        !firstMod.targetClass || m.class === firstMod.targetClass;
      return nameMatch && classMatch && m.slots[slotName];
    });

    if (targetModel) {
      const currentWeapon = targetModel.slots[slotName];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  // If the option itself is a slot type
  if (opt.type === "slot" && opt.slotName) {
    const targetModel = props.unit.models.find((m) => m.slots[opt.slotName!]);
    if (targetModel) {
      const currentWeapon = targetModel.slots[opt.slotName!];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  return "(Default / None)";
};

const getChoicePointsLabel = (choice: any) => {
  // Try weapon name directly first
  let points = equipmentPoints[choice.name as EquipmentName];

  // If not found, check modifications
  if (points === undefined && choice.modifications) {
    for (const mod of choice.modifications) {
      if (mod.setSlot) {
        const weaponName = Object.values(mod.setSlot)[0] as string;
        points = equipmentPoints[weaponName as EquipmentName];
        if (points !== undefined) break;
      }
      if (mod.setUnitSlot) {
        const weaponName = Object.values(mod.setUnitSlot)[0] as string;
        points = equipmentPoints[weaponName as EquipmentName];
        if (points !== undefined) break;
      }
    }
  }

  return points !== undefined ? ` [${points}]` : "";
};

const getOptionPointsLabel = (opt: UnitOptionDef) => {
  if (!opt.choices && opt.modifications) {
    let total = 0;
    let found = false;
    for (const mod of opt.modifications) {
      if (mod.addExtras) {
        total += mod.addExtras.reduce(
          (sum, item) => sum + (equipmentPoints[item as EquipmentName] || 0),
          0,
        );
        found = true;
      }
      if (mod.setSlot) {
        // For toggles that set a slot (like "Replace X with Y"),
        // finding net change is hard without context, but we can show the weapon cost
        const weaponName = Object.values(mod.setSlot)[0] as string;
        const wp = equipmentPoints[weaponName as EquipmentName];
        if (wp !== undefined) {
          total += wp;
          found = true;
        }
      }
    }
    if (found) return ` [${total}]`;
  }
  return "";
};
</script>

<template>
  <div class="unit-item">
    <div class="unit-header">
      <input
        type="text"
        v-model="unit.name"
        class="unit-name-input"
        placeholder="Unit Name"
      />
      <div class="unit-actions">
        <span class="unit-points">{{ unitPoints }} pts</span>
        <button @click="emit('remove', unit.id)" class="remove-btn">
          Delete Unit
        </button>
      </div>
    </div>

    <div class="unit-settings">
      <div class="setting-group">
        <label>Type:</label>
        <select :value="unit.type" @change="onTypeChange">
          <optgroup
            v-for="group in unitGroups"
            :key="group.label"
            :label="group.label"
          >
            <option v-for="type in group.types" :key="type" :value="type">
              {{ type }}
            </option>
          </optgroup>
        </select>
      </div>
      <div class="setting-group">
        <label>Lifeform:</label>
        <select :value="unit.lifeform" @change="onLifeformChange">
          <option v-for="lf in lifeformTypes" :key="lf" :value="lf">
            {{ lf }}
          </option>
        </select>
      </div>
    </div>

    <div class="unit-options" v-if="availableOptions.length > 0">
      <h4>Unit Options</h4>
      <div
        v-for="opt in availableOptions"
        :key="opt.id"
        class="option-item"
      >
        <template v-if="opt.choices">
          <div class="option-select">
            <label :for="opt.id">{{ opt.name }}:</label>
            <select
              :id="opt.id"
              @change="(e) => selectUnitOptionChoice(unit.id, opt.id, (e.target as HTMLSelectElement).value || null)"
            >
              <option v-if="opt.type !== 'slot'" value="">
                {{ getOptionDefaultLabel(opt) }}
              </option>
              <option
                v-for="choice in opt.choices"
                :key="choice.id"
                :value="choice.id"
                :selected="unit.selectedOptions.includes(choice.id)"
              >
                {{ choice.name }}{{ getChoicePointsLabel(choice) }}
              </option>
            </select>
          </div>
        </template>
        <template v-else>
          <div class="option-checkbox">
            <label>
              <input
                type="checkbox"
                :checked="unit.selectedOptions.includes(opt.id)"
                @change="toggleUnitOption(unit.id, opt.id)"
              />
               {{ opt.name }}{{ getOptionPointsLabel(opt) }}
            </label>
          </div>
        </template>
      </div>
    </div>

    <div class="unit-equipment" v-if="Object.keys(unit.slots).length > 0 || unit.extras.length > 0 || armyState.freeEdit">
      <div v-for="(weapon, slot) in unit.slots" :key="slot" class="equipment-item">
        <span class="slot-name">{{ formatSlotName(slot as string) }}:</span>
        <template v-if="armyState.freeEdit">
          <select @change="(e) => addSlotToUnit(unit.id, slot as string, (e.target as HTMLSelectElement).value as EquipmentName)" class="mini-select">
            <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
              <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === weapon">{{ name }} [{{ equipmentPoints[name] }}]</option>
            </optgroup>
          </select>
        </template>
        <template v-else>
          <span class="weapon-name">{{ weapon }}</span>
        </template>
        <span class="weapon-points">[{{ equipmentPoints[weapon] }}]</span>
        <button v-if="armyState.freeEdit" @click="removeSlotFromUnit(unit.id, slot as string)" class="mini-remove-btn">×</button>
      </div>
      <div v-for="(item, index) in unit.extras" :key="'unit-extra-' + index" class="equipment-item">
        <span class="slot-name">+</span>
        <template v-if="armyState.freeEdit">
          <select @change="(e) => {
            removeExtraFromUnit(unit.id, index);
            addExtraToUnit(unit.id, (e.target as HTMLSelectElement).value as EquipmentName);
          }" class="mini-select">
            <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
              <option v-for="name in group.equipment" :key="name" :value="name" :selected="name === item">{{ name }} [{{ equipmentPoints[name] }}]</option>
            </optgroup>
          </select>
        </template>
        <template v-else>
          <span class="weapon-name">{{ item }}</span>
        </template>
        <span class="weapon-points">[{{ equipmentPoints[item] }}]</span>
        <button v-if="armyState.freeEdit" @click="removeExtraFromUnit(unit.id, index)" class="mini-remove-btn">×</button>
      </div>

      <div v-if="armyState.freeEdit" class="manual-add-controls">
        <button @click="addManualSlot" class="add-manual-btn">+ Add Slot</button>
        <button @click="addExtraToUnit(unit.id, 'None')" class="add-manual-btn">+ Add Extra</button>
      </div>
    </div>

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
      <button v-if="armyState.freeEdit" @click="addModelToUnit(unit.id)" class="add-model-btn">
        + Add Model
      </button>
    </div>
  </div>
</template>

<style scoped>
.unit-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .unit-item {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
}

@media (prefers-color-scheme: dark) {
  .unit-item {
    background-color: #1e1e1e;
    border-color: #333;
  }
}

.unit-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

@media (min-width: 600px) {
  .unit-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .unit-header {
    border-bottom-color: #333;
  }
}

.unit-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (min-width: 600px) {
  .unit-settings {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .unit-settings {
    border-bottom-color: #333;
  }
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: bold;
  color: #555;
}

@media (prefers-color-scheme: dark) {
  .setting-group label {
    color: #ccc;
  }
}

.setting-group select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
}

@media (prefers-color-scheme: dark) {
  .setting-group select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.unit-name-input {
  font-size: 1.25rem;
  font-weight: 700;
  border: none;
  background: transparent;
  flex: 1;
}

@media (min-width: 768px) {
  .unit-name-input {
    font-size: 1.5rem;
  }
}

.unit-name-input:focus {
  outline: none;
  border-bottom: 2px solid #4caf50;
}

.unit-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.unit-points {
  font-size: 1.25rem;
  font-weight: bold;
  color: #4caf50;
}

.remove-btn {
  background-color: #ff5252;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.remove-btn:hover {
  background-color: #ff1744;
}

.models-container h4 {
  margin: 0 0 1rem 0;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .models-container h4 {
    color: #aaa;
  }
}

.add-model-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
  width: 100%;
}

@media (prefers-color-scheme: dark) {
  .add-model-btn {
    background-color: #333;
    color: #eee;
  }
}

.add-model-btn:hover {
  background-color: #d0d0d0;
}

@media (prefers-color-scheme: dark) {
  .add-model-btn:hover {
    background-color: #444;
  }
}

.unit-options {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .unit-options {
    border-bottom-color: #333;
  }
}

.unit-options h4, .unit-equipment h4 {
  margin: 0 0 0.75rem 0;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .unit-options h4, .unit-equipment h4 {
    color: #ccc;
  }
}

.unit-equipment {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .unit-equipment {
    border-bottom-color: #333;
  }
}

.equipment-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.slot-name {
  font-weight: bold;
  text-transform: capitalize;
}

.weapon-points {
  color: #4caf50;
  font-size: 0.85rem;
}

.option-item {
  margin-bottom: 0.75rem;
}

.option-select {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-select label {
  font-weight: bold;
  color: #555;
  font-size: 0.95rem;
}

@media (prefers-color-scheme: dark) {
  .option-select label {
    color: #ccc;
  }
}

.option-select select {
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-family: inherit;
  font-size: 0.9rem;
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .option-select select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.option-checkbox {
  margin-bottom: 0.5rem;
}

.option-checkbox label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
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

.mini-select {
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
}

@media (prefers-color-scheme: dark) {
  .mini-select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.manual-add-controls {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
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
