<script setup lang="ts">
import { ref } from "vue";
import UnitList from "./components/UnitList.vue";

const message = ref("Tactics Army Builder");
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
}
.header {
  text-align: center;
  margin-bottom: 2rem;
}
h1 {
  color: #2c3e50;
  font-size: 2.5rem;
}
</style>
