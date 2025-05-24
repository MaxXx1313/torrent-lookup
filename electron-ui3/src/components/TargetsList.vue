<template>
  <div class="layout">
    <div class="list-wrapper">
      <ion-list>
        <ion-item v-for="target in targets">
          <ion-img class="folder-icon" src="folder-icon.png"></ion-img>
          <ion-label>{{ target }}</ion-label>
          <ion-button slot="end" color="danger">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>

        <!--    <MessageListItem v-for="message in messages" :key="message.id" :message="message"/>-->
      </ion-list>
      <div class="add-target-container">
        <ion-button size="small">
          <ion-icon name="add-circle-outline"></ion-icon>
        </ion-button>
      </div>
    </div>

    <div class="layout-space"></div>

    <div>
      <div class="layout-action">
        <ion-fab-button>
          <div>Scan</div>
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

.add-target-container {
  padding: 3px 16px;
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
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { onUnmounted, ref } from 'vue';
import { DataService, ScanOptions } from '@/data/data.service';
import { Subject, takeUntil } from 'rxjs';

const targets = ref<ScanOptions['targets']>([]);

const destroy$ = new Subject<void>();
onUnmounted(() => {
  destroy$.next();
  destroy$.complete();
});

DataService.getTargets().pipe(takeUntil(destroy$)).subscribe(data => {
  targets.value = data;
});
</script>
