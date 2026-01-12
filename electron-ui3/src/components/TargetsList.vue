<template>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto">
    <!-- Top Header -->
    <header
        class="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-slate-400">tune</span>
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Scan Configuration</h2>
      </div>
      <div class="flex items-center gap-3">
        <button
            class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors relative">
          <span class="material-symbols-outlined">notifications</span>
          <span
              class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
        </button>
        <button
            class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <span class="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
    <div class="max-w-5xl w-full mx-auto p-8 flex flex-col gap-8">
      <!-- Page Title -->
      <div class="space-y-2">
        <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">New Scan Configuration</h1>
        <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Configure your filesystem paths and exclusion
          rules before starting the match process. TorrentMapper will index these locations to find matching data for
          your .torrent files.</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Scan Folders -->
        <div class="lg:col-span-2 space-y-6">
          <div
              class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">folder_open</span>
                <h3 class="font-bold text-lg">Add Scan Folders</h3>
              </div>
              <button
                  class="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">add</span>
                Add Path
              </button>
            </div>
            <!-- Folders List -->
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              <div
                  class="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                      class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-outlined">folder</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-200">
                      /mnt/storage/downloads/movies/4k</p>
                    <p class="text-xs text-slate-500">Last scanned: 4 hours ago • 1.2 TB total</p>
                  </div>
                </div>
                <button
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
              <div
                  class="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                      class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-outlined">folder</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-200">/data/media/tv_shows</p>
                    <p class="text-xs text-slate-500">Last scanned: 2 days ago • 4.8 TB total</p>
                  </div>
                </div>
                <button
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
              <div
                  class="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                      class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-outlined">folder</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-200">/home/user/downloads/incoming</p>
                    <p class="text-xs text-slate-500">New directory added</p>
                  </div>
                </div>
                <button
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Scan Options -->
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">settings_suggest</span>
              Advanced Options
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <input checked=""
                       class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                       type="checkbox"/>
                <div>
                  <p class="text-sm font-medium">Recursive Scan</p>
                  <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Include all subfolders</p>
                </div>
              </label>
              <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <input
                    class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                    type="checkbox"/>
                <div>
                  <p class="text-sm font-medium">Verify Checksums</p>
                  <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Slower, but 100% accurate</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        <!-- Right Column: Exclusions -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="material-symbols-outlined text-primary">block</span>
              <h3 class="font-bold text-lg">Exclusions</h3>
            </div>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">Ignore files or folders that match these patterns.
              Useful for skipping metadata, samples, or temp files.</p>
            <div class="space-y-4">
              <div class="relative">
                <input
                    class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary"
                    placeholder="e.g. *.nfo, sample/" type="text"/>
                <button
                    class="absolute right-2 top-2 p-1 text-primary hover:bg-primary/10 rounded-md transition-colors">
                  <span class="material-symbols-outlined text-sm">keyboard_return</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">*.txt</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">sample/</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">*.log</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">@eaDir/</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- System Status -->
          <div class="p-6 bg-primary/5 rounded-xl border border-primary/20">
            <h4 class="text-sm font-bold text-primary mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">info</span>
              Scan Summary
            </h4>
            <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li class="flex justify-between"><span>Active Folders:</span> <span class="font-bold">3</span></li>
              <li class="flex justify-between"><span>Exclusions:</span> <span class="font-bold">4</span></li>
              <li class="flex justify-between"><span>Estimated Size:</span> <span class="font-bold">6.0 TB</span></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Sticky Footer Action -->
      <div class="flex items-center justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <button
            class="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Save Configuration
        </button>
        <button
            class="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <span class="material-symbols-outlined">play_arrow</span>
          Start Scanning
        </button>
      </div>
    </div>
  </main>
  ,

  <ion-note>Configure</ion-note>
  <div class="layout">
    <div class="list-wrapper">
      <ion-list>
        <ion-item v-for="target in targets" :key="target">
          <ion-img class="folder-icon" src="folder-icon.png"></ion-img>
          <ion-label>{{ target }}</ion-label>
          <ion-button slot="end" color="danger" @click="deleteTarget(target)">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item v-if="!targets.length">
          <ion-label class="no-data">no targets</ion-label>
        </ion-item>

        <!--    <MessageListItem v-for="message in messages" :key="message.id" :message="message"/>-->
      </ion-list>
    </div>

    <div class="layout-space"></div>

    <div>
      <div class="layout-action">
        <ion-fab-button @click="addTarget">
          <ion-icon name="add-circle-outline" v-if="!addInProgress"></ion-icon>
          <ion-spinner v-if="addInProgress"></ion-spinner>
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

ion-item:last-child {
  --inner-border-width: 0;
}

.folder-icon {
  height: 24px;
  width: 24px;
  margin-right: 8px;
}
</style>

<!-- -->
<script setup lang="ts">
import { IonButton, IonFabButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonSpinner } from '@ionic/vue';
import { inject, ref } from 'vue';
import { DATA_SERVICE_KEY, DataService, ScanOptions } from '@/data/data.service';
import { bindToComponent } from '@/tools/async';

const targets = ref<ScanOptions['targets']>([]);
const addInProgress = ref<boolean>(false);

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

bindToComponent(dataService.getTargets()).subscribe(data => {
  // TODO: didn't found how to replace an array
  targets.value.splice(0);
  targets.value.push(...data);
});

function addTarget() {
  if (addInProgress.value) {
    return;
  }
  addInProgress.value = true;
  dataService.addTarget().finally(() => {
    addInProgress.value = false;
  });
}

function deleteTarget(target: string) {
  dataService.deleteTarget(target);
}


</script>
