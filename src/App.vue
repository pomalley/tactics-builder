<script setup lang="ts">
import { ref } from "vue";
import UnitList from "./components/UnitList.vue";

const message = ref("5PFH: Tactics Army Builder");
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>{{ message }}</h1>
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
  padding: 1rem;
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .app-container {
    padding: 2rem;
    justify-content: center;
  }
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .header {
    margin-bottom: 2rem;
  }
}

h1 {
  color: #f0c444;
  font-size: 1.75rem;
  margin: 0.5rem 0;
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
}
</style>
