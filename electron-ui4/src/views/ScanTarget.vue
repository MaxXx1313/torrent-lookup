<template>
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">

    <div class="w-full mx-auto px-8 py-4 flex flex-col gap-8">
      <!-- Page Title -->
      <div class="space-y-2">
        <h1 class="text-4xl text-black tracking-tight text-slate-900 dark:text-white">Scan Configuration</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Configure your filesystem paths and exclusion
          rules before starting the match process. TorrentMapper will scan these locations to find matching data for
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
                  class="bg-primary/80 hover:bg-slate/90 disabled:bg-primary/10 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 active:enabled:scale-[0.96]"
                  @click="addTargetsDefault" :disabled="addInProgress">
                <span class="material-symbols-outlined text-sm">add</span>
                Add Default folders
              </button>

              <button
                  class="bg-primary hover:bg-primary/90 disabled:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 active:enabled:scale-[0.96]"
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
<!--                    <p class="text-xs text-slate-500">New directory added</p>-->
                  </div>
                </div>
                <button
                    class="p-2 text-slate-400 hover:text-red-500 flex items-center transition-colors group-hover:opacity-100"
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


          <!-- Scan Options -->
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">settings_suggest</span>
              Advanced Options
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <input v-model="followSymlinks"
                       class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                       type="checkbox"/>
                <div>
                  <p class="text-sm font-medium">Follow symlinks</p>
                  <p class="text-[10px] text-slate-500 tracking-tighter">
                    Include files from symbolic links during scan
                  </p>
                </div>
              </label>
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
              Some system files are still ignored.
              <button class="text-primary text-fg-brand underline"
                      command="show-modal"
                      commandfor="dialog"
                      @click="loadSystemExcluded">
                See the system files
              </button>
            </p>

            <div class="space-y-4">
              <div class="relative">
                <input
                    class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary"
                    placeholder="e.g. *.nfo, sample/"
                    type="text"
                    @keydown.enter="addExclusion"
                    v-model="exclusionAdd"
                />

                <button
                    class="absolute right-0 top-0 bottom-0 px-2 py-1 text-primary enabled:hover:bg-primary/10 rounded-md transition-colors flex items-center disabled:opacity-20"
                    :disabled="!exclusionAdd"
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

      <!-- Bottom Action Bar (Fixed/Sticky behavior simulated with margin) -->
      <div
          class="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
        <div class="flex flex-col"></div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button
              v-if="hasPreviousResults"
              class="flex-1 md:flex-none h-12 px-8 bg-white dark:bg-[#233648] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              @click="goToResults">
            Continue previous scan
          </button>

          <button
              class="px-8 py-3 bg-primary hover:bg-primary/90 disabled:bg-zinc-800 text-white disabled:text-white/60 rounded-lg text-sm font-bold enabled:shadow-lg enabled:shadow-primary/20 flex items-center gap-2 transition-transform active:enabled:scale-[0.98]"
              @click="startScanning"
              :disabled="!targets?.length">
            <span class="material-symbols-outlined">play_arrow</span>
            Start Scanning
          </button>
        </div>
      </div>

    </div>
  </main>

  <!-- -->
  <el-dialog>
    <dialog id="dialog" aria-labelledby="dialog-title"
            class="fixed inset-0 size-auto max-w-none overflow-hidden bg-transparent backdrop:bg-transparent">
      <el-dialog-backdrop
          class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/50"/>

      <div tabindex="0"
           class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
        <el-dialog-panel
            class="relative max-h-[80vh] overflow-hidden flex flex-col rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10">

          <div class="bg-gray-50 px-4 pt-3 pb-2 flex flex-row gap-3 items-center flex-c dark:bg-gray-700/25">
            <div class="mx-auto flex size-8 sm:mx-0 size-4 shrink-0 items-center justify-center">
              <span class="material-symbols-outlined">do_not_disturb_on</span>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">System exclusion</h3>
          </div>

          <div class="overflow-y-auto">
            <div class="bg-white px-4 py-4 dark:bg-gray-800">
                <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <p class="text-sm text-gray-500 dark:text-gray-400" v-html="sysExcluded || 'Loading...'"></p>
                </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 flex flex-row-reverse px-6 dark:bg-gray-700/25">
            <button type="button" command="close" commandfor="dialog"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
              Close
            </button>
          </div>
        </el-dialog-panel>
      </div>
    </dialog>
  </el-dialog>
</template>

<!-- -->
<script setup lang="ts">

import { inject, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { DATA_SERVICE_KEY, DataService } from '@/data/data.service';
import type { ScanConfiguration } from "../../../electron-core/core-lib/types";


const targets = ref<ScanConfiguration['targets']>([]);
const exclude = ref<ScanConfiguration['exclude']>([]);
const followSymlinks = ref<boolean>(false);
const sysExcluded = ref<string>('');
const addInProgress = ref<boolean>(false);
const hasPreviousResults = ref<boolean>(false);

const exclusionAdd = ref('');

const dataService = inject<DataService>(DATA_SERVICE_KEY)!;

const router = useRouter();

watch(followSymlinks, () => {
  _saveConfig();
});

onMounted(async () => {
  const config = await dataService.getConfig();
  targets.value = config?.targets || [];
  exclude.value = config?.exclude || [];
  followSymlinks.value = !!config?.followSymlinks;

  hasPreviousResults.value = (await dataService.getUserMappings())?.length > 0;
});

async function startScanning() {
  const config = await dataService.getConfig();
  dataService.startScan(config);
  router.replace('/progress');
};

function goToResults() {
  router.replace('/results');
}

function addTarget() {
  if (addInProgress.value) {
    return;
  }
  addInProgress.value = true;
  dataService.selectFolder()
      .then((folders: string[] | null) => {
        if (folders) {
          _addTargets(folders);
          _saveConfig();
        }
      }).finally(() => {
    addInProgress.value = false;
  });
}

async function addTargetsDefault() {
  const toAdd = await dataService.getDefaultLocations()
  _addTargets(toAdd);
  _saveConfig();
}

function _addTargets(folders: string[]) {
  if (!folders) {
    return;
  }
  const currFolders = targets.value || [];
  for (const f of folders) {
    if (!currFolders.includes(f)) {
      currFolders.push(f);
    }
  }
  targets.value = currFolders;
}

function deleteTarget(target: string) {
  targets.value = (targets.value || []).filter(t => t !== target);
  _saveConfig();
}

function addExclusion() {
  const toAdd = exclusionAdd.value;
  if (!toAdd) {
    return;
  }
  exclude.value = (exclude.value || []).filter(t => t !== toAdd);
  (exclude.value as string[]).push(toAdd);
  exclusionAdd.value = '';
  _saveConfig();
}

function deleteExclusion(exclusion: string) {
  exclude.value = (exclude.value as string[]).filter(t => t !== exclusion);
  _saveConfig();
}

async function loadSystemExcluded() {
  if (sysExcluded.value) {
    return;
  }
  const excluded = await dataService.getSystemExcluded();
  sysExcluded.value = excluded.join('<br/>');
}

function _saveConfig() {
  dataService.setConfig({
    targets: (targets.value || []).slice(),
    exclude: (exclude.value || []).slice(),
    followSymlinks: !!followSymlinks.value,
  });
}

</script>
