<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import TargetsList from '@/components/TargetsList.vue';
import ScanResults from '@/components/ScanResults.vue';
import HomePageStatus from '@/views/HomePageStatus.vue';


function devTools() {
  window.electronAPI.openDevTools();
}
</script>

<!-- -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Torrent lookup</ion-title>

        <ion-buttons slot="end">
          <ion-button class="debug-btn" fill="clear" color="medium" @click="devTools">
            <ion-icon name="bug-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

      </ion-toolbar>

      <div class="segment-wrapper">
        <ion-segment value="scan">
          <ion-segment-button value="scan" content-id="scan">
            <ion-label>Scan targets</ion-label>
          </ion-segment-button>
          <ion-segment-button value="results" content-id="results">
            <ion-label>Scan results</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>

    <ion-content>
      <ion-segment-view>
        <ion-segment-content id="scan">
          <TargetsList></TargetsList>
        </ion-segment-content>
        <ion-segment-content id="results">
          <ScanResults></ScanResults>
        </ion-segment-content>
      </ion-segment-view>
    </ion-content>

    <HomePageStatus></HomePageStatus>
  </ion-page>
</template>

<!-- -->
<style scoped>
ion-toolbar {
  padding-bottom: 16px;
  position: relative;
  z-index: 1;
}

ion-header {
  background: var(--ion-background-color, #fff);
}

.segment-wrapper {
  padding: 0 16px;
  position: relative;
  z-index: 2;
  transform: translateY(-16px);
  margin: 0 auto;
  max-width: 480px;
  --background: var(--my-segment-background);
  --color: var(--my-segment-color);
}

ion-segment {
  color: var(--my-segment-color);
  --background: var(--my-segment-background);
  border: 1px solid var(--my-segment-border-color);
}

.debug-btn {
  opacity: .2;
}
</style>
