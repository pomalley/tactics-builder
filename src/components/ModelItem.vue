<script setup lang="ts">
import { computed } from "vue";
import type { Model, ModelClass } from "../types";
import { 
  calculateModelPoints, 
  armyState,
  updateModelClass,
  updateModelBasePoints,
  addSlotToModel,
  removeSlotFromModel,
  addExtraToModel,
  removeExtraFromModel
} from "../store";
import { lifeformStats, type Lifeform } from "../data/lifeforms";

import EquipmentManager from "./EquipmentManager.vue";

const props = defineProps<{
  model: Model;
  unitId: string;
}>();

const modelClasses: ModelClass[] = ['Civilian', 'Soldier', 'Minor Character', 'Major Character', 'Epic Character'];

const emit = defineEmits<{
  (e: "remove", modelId: string): void;
}>();

const stats = computed(() => props.model.baseStats ?? (props.model.lifeform && props.model.class ? lifeformStats[props.model.lifeform as Lifeform]?.[props.model.class] : undefined));

const handleRemove = () => {
  emit("remove", props.model.id);
};
</script>

<template>
  <div class="model-item card alt-bg">
    <div class="model-header">
      <input
        type="text"
        v-model="model.name"
        placeholder="Model Name"
        class="input-header model-name-input"
      />
      <button v-if="armyState.freeEdit" @click="handleRemove" class="btn btn-ghost btn-mini remove-btn" title="Remove Model">
        ✕
      </button>
    </div>

    <div class="model-details">
      <div class="field" v-if="model.lifeform">
        <label>Lifeform</label>
        <div class="readonly-text">{{ model.lifeform }}</div>
      </div>
      <div class="field" v-if="model.class">
        <label>Class</label>
        <template v-if="armyState.freeEdit">
          <select :value="model.class" @change="(e) => updateModelClass(unitId, model.id, (e.target as HTMLSelectElement).value as ModelClass)" class="inline-select">
            <option v-for="cls in modelClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <input type="number" :value="model.basePoints" @input="(e) => updateModelBasePoints(unitId, model.id, parseInt((e.target as HTMLInputElement).value) || undefined)" class="mini-pts-input" placeholder="Base Points" />
        </template>
        <div v-else class="readonly-text">
          {{ model.class }}
          <span class="point-badge points-text" v-if="model.basePoints === undefined">[{{ model.baseStats?.points ?? (model.lifeform && model.class ? lifeformStats[model.lifeform as Lifeform]?.[model.class]?.points : 0) ?? 0 }}]</span>
          <span class="point-badge points-text" v-else>[{{ model.basePoints }}]</span>
        </div>
      </div>
      <div class="field points-field">
        <label>Points</label>
        <div class="readonly-text points-text">{{ calculateModelPoints(model) }}</div>
      </div>
    </div>

    <div class="model-stats" v-if="stats">
      <div class="stat-box" title="Speed"><span class="stat-label">SPD</span><span class="stat-value">{{ stats.speed }}"</span></div>
      <div class="stat-box" title="Reaction"><span class="stat-label">REA</span><span class="stat-value">{{ stats.reaction }}</span></div>
      <div class="stat-box" title="Combat Skill"><span class="stat-label">CS</span><span class="stat-value">{{ stats.combatSkill }}</span></div>
      <div class="stat-box" title="Toughness"><span class="stat-label">TGH</span><span class="stat-value">{{ stats.toughness }}</span></div>
      <div class="stat-box" title="Kill Points"><span class="stat-label">KP</span><span class="stat-value">{{ stats.killPoints }}</span></div>
      <div class="stat-box" title="Savvy"><span class="stat-label">SAV</span><span class="stat-value">{{ stats.savvy }}</span></div>
      <div class="stat-box" title="Training"><span class="stat-label">TRN</span><span class="stat-value">{{ stats.training }}</span></div>
      
      <template v-if="stats?.crew !== undefined">
        <div class="stat-box" title="Crew"><span class="stat-label">CRW</span><span class="stat-value">{{ stats.crew }}</span></div>
        <div class="stat-box" title="Capacity"><span class="stat-label">CAP</span><span class="stat-value">{{ stats.capacity }}</span></div>
      </template>
    </div>

    <div class="model-options-container">
      <label>Equipment</label>
      <EquipmentManager
        :target="model"
        @add-slot="(name, weapon) => addSlotToModel(unitId, model.id, name, weapon)"
        @remove-slot="(name) => removeSlotFromModel(unitId, model.id, name)"
        @add-extra="(item) => addExtraToModel(unitId, model.id, item)"
        @remove-extra="(index) => removeExtraFromModel(unitId, model.id, index)"
      />
    </div>
  </div>
</template>

<style scoped>
.model-item {
  margin-bottom: var(--space-sm);
}

.alt-bg {
  background-color: var(--bg-card-alt);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.model-name-input {
  font-size: 1.1em;
}

.model-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

@media (min-width: 600px) {
  .model-details {
    grid-template-columns: 1fr 1fr 100px;
    gap: var(--space-md);
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.field label,
.model-options label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.readonly-text {
  padding: var(--space-xs) 0;
  font-weight: 500;
}

.model-options {
  display: flex;
  flex-direction: column;
}

.point-badge {
  font-size: 0.8rem;
  margin-left: var(--space-xs);
}

.mini-pts-input {
  width: 60px;
}

.model-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
  background: var(--bg-card);
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 40px;
}

.stat-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-main);
}
</style>
