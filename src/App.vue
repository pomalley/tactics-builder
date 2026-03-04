<script setup lang="ts">
import { ref } from "vue";
import UnitList from "./components/UnitList.vue";

const message = ref("5PFH: Tactics Army Builder");
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>{{ message }}</h1>
      <a
        href="https://github.com/pomalley/tactics-builder"
        target="_blank"
        rel="noopener noreferrer"
        class="info-link"
      >
        What is this?
      </a>
    </header>
    <main>
      <UnitList />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .app-container {
    padding: var(--space-lg);
  }
}

.header {
  text-align: center;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .header {
    margin-bottom: var(--space-lg);
  }
}

h1 {
  color: var(--accent);
  font-size: 1.5rem;
  margin: var(--space-sm) 0 var(--space-xs) 0;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}

.info-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.info-link:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>
