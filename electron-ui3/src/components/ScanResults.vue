<template>
  <div class="layout">

    <div class="progress" v-if="scanInProgress">
      <ion-spinner class="progress__spinner"></ion-spinner>
      <div class="progress__target">{{ currentTarget }}</div>
      <ion-button size="small" color="medium" @click="stopScan">
        stop
      </ion-button>
    </div>

    <div class="progress" v-if="!scanInProgress">
      <ion-icon class="progress__spinner" name="stop"></ion-icon>
      <span>Scanning is not started</span>
      <div class="progress__target"></div>
      <ion-button size="small" color="medium" @click="startScan">
        scan
      </ion-button>
    </div>

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

.progress {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ion-color-medium);
  font-weight: 200;
}

.progress__spinner {
  height: 18px;
  flex: 0 0 18px;
}

.progress__target {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>

<!-- -->
<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue';
import { IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { DATA_SERVICE_KEY, DataService } from '@/data/data.service';
import { Subject } from 'rxjs';

const scanInProgress = ref<boolean>(false);

const destroy$ = new Subject<void>();
onUnmounted(() => {
  destroy$.next();
  destroy$.complete();
});

let currentTarget = ref('...');
const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

function startScan() {
  dataService.startScan().subscribe(data => {
    currentTarget.value = data;
  });
}

function stopScan() {
  dataService.stopScan();
}

dataService.isScanning$.subscribe(result => {
  console.log('isScanning$', result)
  scanInProgress.value = !!result;
});

</script>
