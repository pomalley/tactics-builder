<script setup lang="ts">
import { ref, watch } from "vue";
import UnitCatalog from "./components/UnitCatalog.vue";
import ArmyList from "./components/ArmyList.vue";
import UnitEditor from "./components/UnitEditor.vue";
import { appState } from "./store";

const title = ref("5PFH: Tactics Army Builder");

// Mobile navigation state
type ColumnType = 'catalog' | 'army' | 'unit';
const activeMobileColumn = ref<ColumnType>('army');

// Whenever a unit is forcefully selected (e.g. from the army list), switch to unit view on mobile
watch(() => appState.selectedUnitId, (newId) => {
  if (newId) {
    activeMobileColumn.value = 'unit';
  }
});
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-title">
        <h1>{{ title }}</h1>
        <a
          href="https://github.com/pomalley/tactics-builder"
          target="_blank"
          rel="noopener noreferrer"
          class="info-link"
        >
          What is this?
        </a>
      </div>

      <!-- Mobile Navigation -->
      <nav class="mobile-nav">
        <button 
          :class="['nav-btn', { active: activeMobileColumn === 'catalog' }]"
          @click="activeMobileColumn = 'catalog'"
        >
          Catalog
        </button>
        <button 
          :class="['nav-btn', { active: activeMobileColumn === 'army' }]"
          @click="activeMobileColumn = 'army'"
        >
          Army
        </button>
        <button 
          :class="['nav-btn', { active: activeMobileColumn === 'unit' }]"
          @click="activeMobileColumn = 'unit'"
          :disabled="!appState.selectedUnitId"
        >
          Unit
        </button>
      </nav>
    </header>

    <main class="layout-grid">
      <div 
        class="column catalog-column" 
        :class="{ 'mobile-active': activeMobileColumn === 'catalog' }"
      >
        <UnitCatalog />
      </div>

      <div 
        class="column army-column"
        :class="{ 'mobile-active': activeMobileColumn === 'army' }"
      >
        <ArmyList />
      </div>

      <div 
        class="column unit-column"
        :class="{ 'mobile-active': activeMobileColumn === 'unit' }"
      >
        <UnitEditor v-if="appState.selectedUnitId" />
        <div v-else class="empty-editor-state">
          <!-- Hidden per user request on desktop, but taking up grid space if needed -->
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent body scroll, handle in columns */
}

/* Header Styles */
.app-header {
  flex-shrink: 0;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  color: var(--primary);
  font-size: 1.25rem;
  margin: 0;
}

@media (min-width: 1024px) {
  .app-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.info-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.info-link:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Mobile Nav Styles */
.mobile-nav {
  display: flex;
  gap: var(--space-sm);
}

@media (min-width: 1024px) {
  .mobile-nav {
    display: none;
  }
}

.nav-btn {
  flex: 1;
  padding: var(--space-sm);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--bg-card-alt);
}

.nav-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Layout Grid Styles */
.layout-grid {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: var(--bg-main);
  position: relative;
}

.column {
  flex: 1;
  display: none; /* Hidden by default on mobile */
  height: 100%;
  padding: var(--space-md);
  overflow: hidden;
}

.column.mobile-active {
  display: flex;
  flex-direction: column;
}

/* Empty State on right column */
.empty-editor-state {
  display: none; /* Hide when not active completely */
}

@media (min-width: 1024px) {
  .layout-grid {
    display: grid;
    grid-template-columns: 250px 1fr 1fr;
    gap: var(--space-lg);
    padding: var(--space-lg);
  }

  .column {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  /* When there is no selected unit, the unit column collapses or hides via grid span */
  /* Or just let it take its 1fr space empty. 
     User requested "hide it when selectedUnitId is null".
     If we want the layout to adapt and hide the 3rd column space entirely on desktop:
     We could dynamically change the grid-template-columns in JS.
     But keeping the space empty is standard for master-detail views so content doesn't jump.
     We will stick to empty-editor-state being empty, or if they meant 
     "visually hide the card", we just use an empty div. */
}
</style>
