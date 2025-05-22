<template>
  <ion-list>
    <ion-item v-for="target in targets">
      <ion-img class="folder" src="folder-icon.png"></ion-img>
      <ion-label>{{ target }}</ion-label>
      <ion-button slot="end">
        <ion-icon name="trash-outline"></ion-icon>
      </ion-button>
    </ion-item>

    <!--    <MessageListItem v-for="message in messages" :key="message.id" :message="message"/>-->
  </ion-list>
</template>

<!-- -->
<style scoped>
.folder {
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
