<template>
  <div class="layout">
    Scan results
  </div>

</template>

<!-- -->
<style scoped>
.layout {
  padding: 0 16px;
  /*
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  */
}

</style>

<!-- -->
<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue';
import { DATA_SERVICE_KEY, DataService, ScanOptions } from '@/data/data.service';
import { Subject } from 'rxjs';

const targets = ref<ScanOptions['targets']>([]);

const destroy$ = new Subject<void>();
onUnmounted(() => {
  destroy$.next();
  destroy$.complete();
});


const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

</script>
