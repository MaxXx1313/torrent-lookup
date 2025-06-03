<script setup lang="ts">
import { inject, ref } from 'vue';
import { DATA_SERVICE_KEY, DataService } from '@/data/data.service';
import { bindToComponent } from '@/components/async';


const status = ref<string>('-');
const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

bindToComponent(dataService.status$).subscribe(result => {
  switch (result) {
    case "idle":
      status.value = 'Idle';
      break;
    case "scan":
      status.value = 'Scanning...';
      break;
    case "analyze":
      status.value = 'Analyzing...';
      break;
    case "export":
      status.value = 'Exporting...';
      break;
  }
});

</script>

<!-- -->
<template>
  <div class="page-status">
    <span>{{ status }}</span>
  </div>
</template>

<!-- -->
<style scoped>
.page-status {
  padding: 8px;
  font-size: 13px;
  background: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  font-weight: 300;
}
</style>
