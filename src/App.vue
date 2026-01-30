<script setup>
import HeaderComponentVue from "./components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponentVue />
  <main class="h-screen">

    <router-view></router-view>
  </main>
</template>

<style scoped></style>
