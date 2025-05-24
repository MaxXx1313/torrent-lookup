<script setup lang="ts">
import { inject, ref } from 'vue';
import { DATA_SERVICE_KEY, DataService } from '@/data/data.service';
import { bindToComponent } from '@/components/async';


const scanInProgress = ref<boolean>(false);
const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

bindToComponent(dataService.isScanning$).subscribe(result => {
  scanInProgress.value = !!result;
});

</script>

<!-- -->
<template>
  <div class="page-status">
    <span v-if="scanInProgress">Scanning...</span>
    <span v-if="!scanInProgress">Idle</span>
  </div>
</template>

<!-- -->
<style scoped>
.page-status {
  padding: 8px;
  font-size: 13px;
  background: var(--ion-color-light);
  font-weight: 300;
}
</style>
