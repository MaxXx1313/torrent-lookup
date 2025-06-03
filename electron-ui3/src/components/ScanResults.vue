<template>
  <div class="layout">


    <div class="progress" v-if="status=='idle'">
      <ion-icon class="progress__spinner" name="stop"></ion-icon>
      <span>Scanning is not started</span>
      <div class="progress__target"></div>
      <ion-button size="small" color="medium" @click="startScan">
        scan
      </ion-button>
    </div>

    <div class="progress" v-if="status=='scan'">
      <ion-spinner class="progress__spinner"></ion-spinner>
      <div class="progress__target">{{ currentTarget }}</div>
      <ion-button size="small" color="medium" @click="stopScan">
        stop
      </ion-button>
    </div>
    <div class="progress" v-if="status=='analyze'">
      <ion-spinner class="progress__spinner"></ion-spinner>
      <div class="progress__target">Analyzing...</div>
      <ion-button size="small" v-bind:disabled="true" color="medium" @click="stopScan">
        stop
      </ion-button>
    </div>

  </div>
  <ion-list v-if="analyzeResults===null">
    <ion-item v-for="r in scanFound" :key="r">
      <ion-img class="torrent__icon" src="torrent-icon.svg"></ion-img>
      <ion-label class="torrent__name">{{ r }}</ion-label>
    </ion-item>
  </ion-list>
  <ion-list v-if="analyzeResults!==null">
    <ion-item v-for="r in analyzeResults" :key="r.torrent">
      <ion-img class="torrent__icon" src="torrent-icon.svg"></ion-img>
      <ion-label class="torrent__name">{{ r.torrent }}</ion-label>
      <ion-label class="torrent__name">{{ r.saveTo }}</ion-label>
    </ion-item>
  </ion-list>

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

.torrent__icon {
  margin-right: 8px;
  height: 18px;
  width: 18px;
  flex: 0 0 18px;
}

.torrent__name {
  font-weight: 300;
}

</style>

<!-- -->
<script setup lang="ts">
import { inject, ref } from 'vue';
import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonSpinner } from '@ionic/vue';
import { DATA_SERVICE_KEY, DataService, ScanStatus, TorrentMapping } from '@/data/data.service';
import { bindToComponent } from '@/components/async';

const status = ref<ScanStatus>('idle');

let currentTarget = ref('...');
let scanFound = ref<string[]>([]);
let analyzeResults = ref<TorrentMapping[] | null>(null);

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

function startScan() {
  analyzeResults.value = null;
  dataService.startScan();
}

function stopScan() {
  dataService.stopScan();
}

bindToComponent(dataService.scanTarget$).subscribe(data => {
  currentTarget.value = data;
});

bindToComponent(dataService.status$).subscribe(result => {
  status.value = result;
});
bindToComponent(dataService.analyzeResults$).subscribe(result => {
  analyzeResults.value = [];
  analyzeResults.value.push(...result);
});

</script>
