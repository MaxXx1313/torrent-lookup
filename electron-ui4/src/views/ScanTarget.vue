<template>
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">

    <div class="w-full mx-auto px-8 py-4 flex flex-col gap-8">
      <!-- Page Title -->
      <div class="space-y-2">
        <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Scan Configuration</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Configure your filesystem paths and exclusion
          rules before starting the match process. TorrentMapper will index these locations to find matching data for
          your .torrent files.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Column: Scan Folders -->
        <div class="md:col-span-2 space-y-6">
          <div
              class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">folder_open</span>
                <h3 class="font-bold text-lg">Add Scan Folders</h3>
              </div>

              <button
                  class="bg-primary hover:bg-primary/90 disabled:bg-primary/10 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 active:enabled:scale-[0.96]"
                  @click="addTarget" :disabled="addInProgress">
                <span class="material-symbols-outlined text-sm">add</span>
                Add Path
              </button>
            </div>


            <!-- Folders List -->
            <div class="divide-y divide-slate-100 dark:divide-slate-800">

              <!--
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
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors group-hover:opacity-100">
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
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors group-hover:opacity-100">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
-->

              <div v-for="t in targets"
                   class="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                      class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-outlined">folder</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-200">{{ t }}</p>
                    <p class="text-xs text-slate-500">New directory added</p>
                  </div>
                </div>
                <button
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors group-hover:opacity-100"
                    @click="deleteTarget(t)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <div v-if="!targets?.length" class="p-4">
                <div>
                  <p class="text-xs text-center text-slate-500 italic">No targets</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Right Column: Exclusions -->
        <div class="space-y-6 h-full">
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-primary">do_not_disturb_on</span>
              <h3 class="font-bold text-lg">Exclusions</h3>
            </div>

            <p class="text-xs text-slate-500 mb-2 leading-relaxed">
              Ignore files or folders that match these patterns.
              Useful for skipping metadata, samples, or temp files.</p>
            <p class="text-xs text-slate-500 mb-2 leading-relaxed">
              Some system files are still ignored.</p>

            <div class="space-y-4">
              <div class="relative">
                <input
                    class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary"
                    placeholder="e.g. *.nfo, sample/"
                    type="text"
                    @submit="addExclusion"
                    v-model="exclusionAdd"
                />
                <button
                    class="absolute right-0 top-0 bottom-0 px-2 py-1 text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center"
                    @click="addExclusion">
                  <span class="material-symbols-outlined text-sm">keyboard_return</span>
                </button>
              </div>

              <div class="flex flex-wrap gap-2">

                <div v-for="t in exclude"
                     class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ t }}</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 flex items-center"
                          @click="deleteExclusion(t)">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- System Status -->
          <!--
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
          -->
        </div>
      </div>
      <!-- Sticky Footer Action -->
      <footer class="flex items-center justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <button
            class="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Save Configuration
        </button>
        <button
            class="px-8 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/10 text-white rounded-lg text-sm font-bold enabled:shadow-lg enabled:shadow-primary/20 flex items-center gap-2 transition-transform active:enabled:scale-[0.98]"
            @click="goToScanningPage"
            :disabled="!targets?.length">
          <span class="material-symbols-outlined">play_arrow</span>
          Start Scanning
        </button>
      </footer>
    </div>
  </main>
</template>

<!-- -->
<script setup lang="ts">

import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { DATA_SERVICE_KEY, DataService } from '@/data/data.service';
import type { AppConfiguration } from "../../../electron-core/core-lib/types";


const targets = ref<AppConfiguration['targets']>([]);
const exclude = ref<AppConfiguration['exclude']>([]);
const addInProgress = ref<boolean>(false);

const exclusionAdd = ref('');

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

const router = useRouter();

onMounted(async () => {
  const config = await dataService.getConfig();
  targets.value = config?.targets || [];
  exclude.value = config?.exclude || [];
});

const goToScanningPage = () => {
  // You can use a string path or a named route object
  router.push('/progress');
};

// bindToComponent(dataService.getTargets()).subscribe(data => {
//   // TODO: didn't found how to replace an array
//   targets.value.splice(0);
//   targets.value.push(...data);
// });

function addTarget() {
  if (addInProgress.value) {
    return;
  }
  addInProgress.value = true;
  dataService.selectFolder()
      .then((folders: string[]) => {
        if (folders) {
          targets.value.push(...folders);
          _saveConfig();
        }
      }).finally(() => {
    addInProgress.value = false;
  });
}

function deleteTarget(target: string) {
  targets.value = (targets.value || []).filter(t => t !== target);
  _saveConfig();
}

function addExclusion() {
  (exclude.value as string[]).push(exclusionAdd.value);
  exclusionAdd.value = '';
  _saveConfig();
}

function deleteExclusion(exclusion: string) {
  exclude.value = (exclude.value as string[]).filter(t => t !== exclusion);
  _saveConfig();
}

function _saveConfig() {
  dataService.setConfig({
    targets: (targets.value || []).slice(),
    exclude: (exclude.value || []).slice(),
  });
}

</script>
