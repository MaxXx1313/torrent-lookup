<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { provide } from 'vue';
import { DataService, DATA_SERVICE_KEY } from '@/data/data.service';

const dataService = new DataService();
provide(DATA_SERVICE_KEY, dataService);
dataService.appReady();

</script>
<style>
  @import "tailwindcss";

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
</style>