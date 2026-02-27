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
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  box-sizing: border-box;
}
.header {
  text-align: center;
  margin-bottom: 2rem;
}
h1 {
  color: #f0c444;
  font-size: 2.5rem;
}
</style>
