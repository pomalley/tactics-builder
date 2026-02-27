<script setup lang="ts">
import { computed } from "vue";
import type { Unit, UnitType, UnitOptionDef } from "../types";
import {
  unitOptions,
  weaponPoints,
  unitDefinitions,
  lifeformClassPoints,
  type EquipmentName,
  type Lifeform,
} from "../data";
import ModelItem from "./ModelItem.vue";
import {
  addModelToUnit,
  removeModelFromUnit,
  calculateUnitPoints,
  changeUnitType,
  changeUnitLifeform,
  toggleUnitOption,
  selectUnitOptionChoice,
} from "../store";
import { formatSlotName } from "../utils";

const props = defineProps<{
  unit: Unit;
}>();

const unitTypes = Object.keys(unitDefinitions) as UnitType[];
const lifeformTypes = Object.keys(lifeformClassPoints) as Lifeform[];

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
    const points = weaponPoints[currentWeapon as EquipmentName];
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
            const points = weaponPoints[currentWeapon as EquipmentName];
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
      const points = weaponPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  // If the option itself is a slot type
  if (opt.type === "slot" && opt.slotName) {
    const targetModel = props.unit.models.find((m) => m.slots[opt.slotName!]);
    if (targetModel) {
      const currentWeapon = targetModel.slots[opt.slotName!];
      const points = weaponPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  return "(Default / None)";
};

const getChoicePointsLabel = (choice: any) => {
  // Try weapon name directly first
  let points = weaponPoints[choice.name as EquipmentName];

  // If not found, check modifications
  if (points === undefined && choice.modifications) {
    for (const mod of choice.modifications) {
      if (mod.setSlot) {
        const weaponName = Object.values(mod.setSlot)[0] as string;
        points = weaponPoints[weaponName as EquipmentName];
        if (points !== undefined) break;
      }
      if (mod.setUnitSlot) {
        const weaponName = Object.values(mod.setUnitSlot)[0] as string;
        points = weaponPoints[weaponName as EquipmentName];
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
          (sum, item) => sum + (weaponPoints[item as EquipmentName] || 0),
          0,
        );
        found = true;
      }
      if (mod.setSlot) {
        // For toggles that set a slot (like "Replace X with Y"),
        // finding net change is hard without context, but we can show the weapon cost
        const weaponName = Object.values(mod.setSlot)[0] as string;
        const wp = weaponPoints[weaponName as EquipmentName];
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
          <option v-for="type in unitTypes" :key="type" :value="type">
            {{ type }}
          </option>
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

    <div class="unit-equipment" v-if="Object.keys(unit.slots).length > 0 || unit.extras.length > 0">
      <div v-for="(weapon, slot) in unit.slots" :key="slot" class="equipment-item">
        <span class="slot-name">{{ formatSlotName(slot as string) }}:</span>
        <span class="weapon-name">{{ weapon }}</span>
        <span class="weapon-points">[{{ weaponPoints[weapon] }}]</span>
      </div>
      <div v-for="(item, index) in unit.extras" :key="'unit-extra-' + index" class="equipment-item">
        <span class="slot-name">+</span>
        <span class="weapon-name">{{ item }}</span>
        <span class="weapon-points">[{{ weaponPoints[item] }}]</span>
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
      <button @click="addModelToUnit(unit.id)" class="add-model-btn">
        + Add Model
      </button>
    </div>
  </div>
</template>

<style scoped>
.unit-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  .unit-item {
    background-color: #1e1e1e;
    border-color: #333;
  }
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .unit-header {
    border-bottom-color: #333;
  }
}

.unit-settings {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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
  font-size: 1.5rem;
  font-weight: 700;
  border: none;
  background: transparent;
  flex: 1;
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
</style>
