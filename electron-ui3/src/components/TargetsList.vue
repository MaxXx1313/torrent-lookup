<template>
  <div class="layout">
    <div class="list-wrapper">
      <ion-list>
        <ion-item v-for="target in targets" :key="target">
          <ion-img class="folder-icon" src="folder-icon.png"></ion-img>
          <ion-label>{{ target }}</ion-label>
          <ion-button slot="end" color="danger">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>

        <!--    <MessageListItem v-for="message in messages" :key="message.id" :message="message"/>-->
      </ion-list>
    </div>

    <div class="layout-space"></div>

    <div>
      <div class="layout-action">
        <ion-fab-button @click="addTarget">
          <ion-icon name="add-circle-outline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="devTools">
          <ion-icon name="bug-outline"></ion-icon>
        </ion-fab-button>
      </div>
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

.layout-space {
  height: 32px;
}

.layout-action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.list-wrapper {
  border: 1px solid var(--ion-color-light);
  border-radius: 6px;
}

ion-item::part(native) {
  padding: 0;
}

.folder-icon {
  height: 24px;
  width: 24px;
  margin-right: 8px;
}
</style>

<!-- -->
<script setup lang="ts">
import { IonButton, IonFabButton, IonIcon, IonImg, IonItem, IonLabel, IonList } from '@ionic/vue';
import { inject, onUnmounted, ref } from 'vue';
import { DATA_SERVICE_KEY, DataService, ScanOptions } from '@/data/data.service';
import { Subject, takeUntil } from 'rxjs';

const targets = ref<ScanOptions['targets']>([]);

const destroy$ = new Subject<void>();
onUnmounted(() => {
  // destroy$.next();
  // destroy$.complete();
});

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;
dataService.getTargets().pipe(takeUntil(destroy$)).subscribe(data => {
  // TODO: didn't found how to replace an array
  targets.value.splice(0);
  targets.value.push(...data);
});

function addTarget() {
  dataService.addTarget();
}

function devTools() {
  window.electronAPI.openDevTools();
}

</script>
