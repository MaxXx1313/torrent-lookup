<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Top Header -->
  <header
      class="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-slate-400">tune</span>
      <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Scan Configuration</h2>
    </div>
    <!--
    <div class="flex items-center gap-3">
      <button
          class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors relative">
        <span class="material-symbols-outlined">notifications</span>
        <span
            class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
      </button>
      <button
          class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
        <span class="material-symbols-outlined">help</span>
      </button>
    </div>
    -->
  </header>
  <!--
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125"/>

    <div class="wrapper">
      <HelloWorld msg="You did it!"/>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/target">Scan target</RouterLink>
      </nav>
    </div>
  </header>
  -->

  <RouterView/>
</template>

<style scoped>
</style>

<style>
@import "tailwindcss";

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
