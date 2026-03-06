<script setup lang="ts">
import type { EquipmentDef } from '../types';
import {
  type EquipmentName,
  equipmentPoints,
  equipmentGroups,
  equipmentDefinitions,
} from '../data/equipment';
import { armyState } from '../store';
import { formatSlotName } from '../utils';

const props = defineProps<{
  target: { slots: Record<string, EquipmentName>; extras: EquipmentName[] };
  onAddSlot: (name: string, weapon: EquipmentName) => void;
  onRemoveSlot: (name: string) => void;
  onAddExtra: (item: EquipmentName) => void;
  onRemoveExtra: (index: number) => void;
}>();

const addManualSlot = () => {
  const name = window.prompt('Slot Name (e.g. turret, sidearm, etc.):');
  if (name) props.onAddSlot(name, 'None');
};

const getDef = (name: EquipmentName): EquipmentDef => equipmentDefinitions[name] as EquipmentDef;

const formatStats = (name: EquipmentName) => {
  const def = getDef(name);
  if (!def.weapon && (!def.traits || def.traits.length === 0)) return '';

  let stats = '';
  if (def.weapon) {
    const w = def.weapon;
    const parts = [];
    if (w.range) parts.push(`${w.range}"`);
    parts.push(`S${w.shots ?? '-'}`);
    parts.push(`D${w.damage ?? '-'}${w.bonusDamage ? `(x${w.bonusDamage})` : ''}`);
    stats += parts.join(' ');
  }

  if (def.traits && def.traits.length > 0) {
    if (stats) stats += ' ';
    stats += def.traits.join(' • ');
  }

  return stats ? ` | ${stats}` : '';
};
</script>

<template>
  <div
    class="equipment-manager"
    v-if="Object.keys(target.slots).length > 0 || target.extras.length > 0 || armyState.freeEdit"
  >
    <div v-for="(weapon, slot) in target.slots" :key="slot" class="equipment-row">
      <div class="equipment-item">
        <span class="slot-name">{{ formatSlotName(slot as string) }}:</span>
        <template v-if="armyState.freeEdit">
          <select
            @change="
              (e) =>
                onAddSlot(slot as string, (e.target as HTMLSelectElement).value as EquipmentName)
            "
          >
            <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
              <option
                v-for="name in group.equipment"
                :key="name"
                :value="name"
                :selected="name === weapon"
              >
                {{ name }} [{{ equipmentPoints[name] }}]{{ formatStats(name) }}
              </option>
            </optgroup>
          </select>
          <button
            @click="onRemoveSlot(slot as string)"
            class="btn btn-danger btn-mini mini-remove-btn"
            title="Remove Slot"
          >
            ×
          </button>
        </template>
        <template v-else>
          <span class="weapon-name">{{ weapon }}</span>
        </template>
        <span class="weapon-points points-text">[{{ equipmentPoints[weapon] || 0 }}]</span>

        <div
          v-if="getDef(weapon).weapon || getDef(weapon).traits?.length"
          class="weapon-info-inline"
        >
          <div v-if="getDef(weapon).weapon" class="weapon-stats-compressed">
            <span class="stat">{{
              getDef(weapon).weapon?.range ? getDef(weapon).weapon?.range + '"' : ''
            }}</span>
            <span class="stat">S{{ getDef(weapon).weapon?.shots ?? '-' }}</span>
            <span class="stat"
              >D{{ getDef(weapon).weapon?.damage ?? '-'
              }}{{
                getDef(weapon).weapon?.bonusDamage
                  ? '(x' + getDef(weapon).weapon?.bonusDamage + ')'
                  : ''
              }}</span
            >
          </div>
          <div v-if="getDef(weapon).traits?.length" class="traits-list-inline">
            <span class="trait-text">{{ getDef(weapon).traits?.join(' • ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(item, index) in target.extras" :key="'extra-' + index" class="equipment-row">
      <div class="equipment-item">
        <span class="slot-name">+</span>
        <template v-if="armyState.freeEdit">
          <select
            @change="
              (e) => {
                onRemoveExtra(index);
                onAddExtra((e.target as HTMLSelectElement).value as EquipmentName);
              }
            "
          >
            <optgroup v-for="group in equipmentGroups" :key="group.label" :label="group.label">
              <option
                v-for="name in group.equipment"
                :key="name"
                :value="name"
                :selected="name === item"
              >
                {{ name }} [{{ equipmentPoints[name] }}]{{ formatStats(name) }}
              </option>
            </optgroup>
          </select>
          <button
            @click="onRemoveExtra(index)"
            class="btn btn-danger btn-mini mini-remove-btn"
            title="Remove Extra"
          >
            ×
          </button>
        </template>
        <template v-else>
          <span class="weapon-name">{{ item }}</span>
        </template>
        <span class="weapon-points points-text">[{{ equipmentPoints[item] || 0 }}]</span>

        <div v-if="getDef(item).weapon || getDef(item).traits?.length" class="weapon-info-inline">
          <div v-if="getDef(item).weapon" class="weapon-stats-compressed">
            <span class="stat">{{
              getDef(item).weapon?.range ? getDef(item).weapon?.range + '"' : ''
            }}</span>
            <span class="stat">S{{ getDef(item).weapon?.shots ?? '-' }}</span>
            <span class="stat"
              >D{{ getDef(item).weapon?.damage ?? '-'
              }}{{
                getDef(item).weapon?.bonusDamage
                  ? '(x' + getDef(item).weapon?.bonusDamage + ')'
                  : ''
              }}</span
            >
          </div>
          <div v-if="getDef(item).traits?.length" class="traits-list-inline">
            <span class="trait-text">{{ getDef(item).traits?.join(' • ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="armyState.freeEdit" class="manual-add-controls">
      <button @click="addManualSlot" class="btn btn-primary add-manual-btn">+ Add Slot</button>
      <button @click="onAddExtra('None')" class="btn btn-primary add-manual-btn">
        + Add Extra
      </button>
    </div>
  </div>
</template>

<style scoped>
.equipment-manager {
  margin-bottom: var(--space-sm);
}

.equipment-row {
  margin-bottom: 2px;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.slot-name {
  font-weight: bold;
  text-transform: capitalize;
  min-width: 4rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.weapon-name {
  font-weight: 600;
}

.weapon-points {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: bold;
}

.weapon-info-inline {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: var(--space-xs);
}

.weapon-stats-compressed {
  display: flex;
  gap: var(--space-xs);
  color: var(--text-main);
  font-weight: 500;
}

.stat {
  white-space: nowrap;
}

.traits-list-inline {
  display: flex;
  gap: var(--space-xs);
}

.trait-text {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.85rem;
}

.manual-add-controls {
  margin-top: var(--space-sm);
  display: flex;
  gap: var(--space-xs);
}
</style>
