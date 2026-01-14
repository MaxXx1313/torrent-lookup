<template>
  <main class="flex-1 flex flex-col lg:flex-row mx-auto w-full px-8 py-4 gap-8">
    <!-- Left Content Area -->
    <div class="flex-1 flex flex-col gap-8">
      <!-- Page Heading -->
      <div class="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Export
          </h1>
          <p class="text-slate-500 dark:text-[#92adc9] text-sm font-normal">
            Select your target torrent client and configure the
            connection to begin the file association process</p>
        </div>
      </div>

      <!-- Target Selection -->
      <section class="flex flex-col gap-4">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <span class="flex items-center justify-center bg-primary text-white size-6 rounded-full text-xs">1</span>
          Select Target Client
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <!-- Client Option 1 (Selected) -->
          <div
              class="group relative cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-primary bg-primary/10 transition-all shadow-lg shadow-primary/5">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <IconTransmission/>
            </div>
            <p class="font-bold text-sm">Transmission</p>

            <div class="absolute top-2 right-2 text-primary">
              <span class="material-symbols-outlined text-lg">check_circle</span>
            </div>
          </div>
          <!-- Client Option 2 -->
          <!--
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <img class="object-contain" alt="Transmission"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB7CxAjne4I-jAYw2E6tP1tg46_ISIeChMAd8RJEviMKwsKr8pQfEE7RiT1W7UN3LYn4HbscR8SCeqG1nPxLvhEbpO1H0JweQfCjJBPB-PvZsKxgc7AvEU6fdZhTXMCayZ1_nnzsEpm47M0czs9Cla0qklWtfWl7tuxBt2hozDM86RL2IOgVfoLlP_Frk8nd36Gv593fYEug3hpuSB7GmiAShGo1gIVV7Y8WjJaJLenIvp-0Y-Kif5YaQ1jTNp9joJxTTZATvP8sE"/>
            </div>
            <p class="font-bold text-sm text-slate-400">Transmission</p>
          </div>
          -->

          <!-- Client Option 3 -->
          <!--
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <img class="object-contain" alt="Deluge"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7UBc2VSE2kkhBTkqiSGUAevbmrIcObB_ZxuLaLSDYDSCBZbabzCLGDCz9TO8Ao5Z57in13eY8oAsv3wIYIErWxZUI1CQ25OtqP4N9OvD0rob_jgkFfLyL06jeuSJ7cWCP8oyZzSDMtLVaYKgX-IRf0Vnel2usT3Dy8zGzuCrN1A3ph6YT9fbbIKbBI-k4WicPCIoAwDU1TRzXsV9371airyLXjX-6oVxEU6wT3RxlKSAA9W45bW63-rMWZEm-aRFVqMoI7bG0DYU"/>
            </div>
            <p class="font-bold text-sm text-slate-400">Deluge</p>
          </div>
          -->

          <!-- Client Option 4 -->
          <!--
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <span class="material-symbols-outlined text-4xl text-slate-500">terminal</span>
            </div>
            <p class="font-bold text-sm text-slate-400">JSON Export</p>
          </div>
          -->
        </div>
      </section>

      <!-- Configuration Form -->
      <section
          class="flex flex-col gap-6 p-6 rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#16222c]">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <span class="flex items-center justify-center bg-primary text-white size-6 rounded-full text-xs">2</span>
          Transmission Configuration
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2 col-span-2">
            <label class="text-sm font-semibold text-slate-500">API Host URL</label>
            <input
                class="bg-background-light dark:bg-[#101922] border-slate-300 dark:border-[#233648] rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                type="text" value="http://localhost:8080"/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-500">Username</label>
            <input
                class="bg-background-light dark:bg-[#101922] border-slate-300 dark:border-[#233648] rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                type="text" value="admin"/>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-500">Password</label>
            <input
                class="bg-background-light dark:bg-[#101922] border-slate-300 dark:border-[#233648] rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                type="password" value="••••••••"/>
          </div>
        </div>
        <hr class="border-slate-200 dark:border-[#233648] my-2"/>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-[#101922]/50">
            <div class="flex flex-col">
              <span class="font-medium">Start Paused</span>
              <span class="text-xs text-slate-500">Torrents will be added in a paused state for review</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input checked="" class="sr-only peer" type="checkbox"/>
              <div
                  class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-[#101922]/50">
            <div class="flex flex-col">
              <span class="font-medium">Skip Hash Check</span>
              <span class="text-xs text-slate-500">Import faster by assuming files are valid</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input class="sr-only peer" type="checkbox"/>
              <div
                  class="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

      </section>


      <!-- Bottom Action Bar (Fixed/Sticky behavior simulated with margin) -->
      <footer
          class="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
        <div class="flex flex-col"></div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <button
              class="flex-1 md:flex-none h-12 px-8 bg-white dark:bg-[#233648] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              @click="backToResults">
            Back to Results
          </button>

          <!--
          <button
              class="px-6 py-3 border border-slate-300 dark:border-[#233648] font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">network_check</span>
            Test
          </button>
          -->

          <button
              class="flex-1 md:flex-none h-12 px-10 bg-primary text-white disabled:text-white/60 disabled rounded-lg font-bold text-base enabled:shadow-lg enabled:shadow-primary/30 active:enabled:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800"
              @click="runExport">
            <span class="material-symbols-outlined">publish</span>
            Run Export
          </button>
        </div>
      </footer>
    </div>

    <!-- Right Side Panel (Help & Guides) -->
    <aside class="w-full lg:w-80 flex flex-col gap-4">
      <div
          class="sticky top-24 bg-white dark:bg-[#16222c] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        <div class="p-5 border-b border-slate-200 dark:border-[#233648]">
          <h2 class="text-lg font-bold">Help &amp; Guides</h2>
          <p class="text-sm text-slate-500 dark:text-[#92adc9]">Setting up API access for your client</p>
        </div>
        <div class="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
          <ExportHelp/>
        </div>
      </div>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import IconTransmission from "@/components/icons/IconTransmission.vue";
import { inject, onMounted, ref } from "vue";
import type { TorrentMapping } from "@/data/types.ts";
import { DATA_SERVICE_KEY, DataService } from "@/data/data.service.ts";
import ExportHelp from "@/views/ExportHelp.vue";

const router = useRouter();

const mappings = ref<TorrentMapping[]>([]);
const dataService = inject<DataService>(DATA_SERVICE_KEY)!;


onMounted(async () => {

});

function backToResults() {
  // You can use a string path or a named route object
  router.push('/results');
}

function runExport() {
  // You can use a string path or a named route object
  router.push('/exportprogress');
}
</script>