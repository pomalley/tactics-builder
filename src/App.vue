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
  padding: 0.75rem;
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .app-container {
    padding: 1rem;
  }
}

.header {
  text-align: center;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .header {
    margin-bottom: 1rem;
  }
}

h1 {
  color: #f0c444;
  font-size: 1.5rem;
  margin: 0.5rem 0 0.25rem 0;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}

.info-link {
  color: #f0c444;
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
