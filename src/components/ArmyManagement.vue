<script setup lang="ts">
import { ref } from 'vue';
import {
  appState,
  armyState,
  addArmy,
  removeArmy,
  exportArmy,
  importArmy,
  getShareLink,
} from '../store';

const fileInput = ref<HTMLInputElement | null>(null);

const onImportClick = () => {
  fileInput.value?.click();
};

const onShareClick = async () => {
  const link = await getShareLink(armyState.id);
  if (link) {
    await navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    importArmy(content);
    target.value = '';
  };
  reader.readAsText(file);
};

const onRemoveArmy = () => {
  if (confirm(`Are you sure you want to delete "${armyState.name}"?`)) {
    removeArmy(armyState.id);
  }
};
</script>

<template>
  <div class="management-actions">
    <button @click="addArmy" class="btn btn-blue" title="New Army">+</button>
    <button @click="onImportClick" class="btn btn-secondary" title="Import Army">⤒</button>
    <button @click="exportArmy(armyState.id)" class="btn btn-secondary" title="Export Army">
      ⤓
    </button>
    <button @click="onShareClick" class="btn btn-secondary" title="Share Army">🔗</button>
    <button
      @click="onRemoveArmy"
      class="btn btn-danger"
      :disabled="appState.armies.length <= 1"
      title="Delete Army"
    >
      🗑
    </button>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept=".json"
      @change="handleFileUpload"
    />
  </div>
</template>

<style scoped>
.management-actions {
  display: flex;
  gap: var(--space-xs);
}

.management-actions .btn {
  padding: var(--space-xs) var(--space-sm);
  min-width: 32px;
}
</style>
