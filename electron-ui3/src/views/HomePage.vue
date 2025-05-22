<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonSegment, IonSegmentContent, IonTitle, IonToolbar } from '@ionic/vue';
import TargetsList from '@/components/TargetsList.vue';
</script>

<!-- -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Torrent lookup</ion-title>
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
        <ion-segment-content id="results">Results</ion-segment-content>
      </ion-segment-view>
    </ion-content>
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
</style>
