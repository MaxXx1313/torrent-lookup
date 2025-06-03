<template>
  <div class="layout">


    <div class="progress" v-if="status=='idle'">
      <ion-icon class="progress__spinner" name="stop"></ion-icon>
      <span>Stopped</span>
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
  <ion-list v-if="status=='idle'">
    <ion-item v-for="r in analyzeResults" :key="r.torrent">
      <div class="result">
        <div class="row">
          <ion-img class="torrent__icon" src="torrent-icon.svg"></ion-img>
          <ion-label class="torrent__name">{{ r.torrent }}</ion-label>
        </div>
        <div class="row row--green">
          <ion-icon class="torrent__icon" name="arrow-down-circle-outline"></ion-icon>
          <ion-label class="torrent__location">{{ r.saveTo }}</ion-label>
        </div>
      </div>
    </ion-item>

    <ion-item v-if="!analyzeResults.length">
      <ion-label class="no-data">empty</ion-label>
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

.row {
  display: flex;
  gap: .5ch;
}

.row--green {
  color: var(--ion-color-success);
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

.result {
  padding: 4px 0;
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

.torrent__location {
  font-weight: 400;
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
let analyzeResults = ref<TorrentMapping[]>([]);

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

function startScan() {
  analyzeResults.value = [];
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
