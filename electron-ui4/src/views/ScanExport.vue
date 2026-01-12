<template>
  <main class="flex-1 flex flex-col lg:flex-row mx-auto w-full p-8 gap-8">
    <!-- Left Content Area -->
    <div class="flex-1 flex flex-col gap-8">
      <!-- Page Heading -->
      <div class="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Export Settings
          </h1>
          <p class="text-slate-500 dark:text-[#92adc9] text-base font-normal">
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
              <img class="object-contain" alt="qBittorrent"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaQCW4LDHTWI1sfAqepT9DQt1MuI4mvt-XS_mYUZWPcUslR5uo2sOt4Evkrm8TN1khlanalUSA-t63lajBze-qxtpyJaalzgNwYhzh0sHJ4WByxabHb6WCS2idv7LUPryQK-eSp46InF1-EwRIiBJEqybPmGBHiLlcDVR1Wvhnwdx6tGGRR3YH9xKxGX-QFov2IXsDaHzR5_H4cj8zJIm_VnBzchndRMyrj_hG1opZCeDJ9oPgP4u0hYBXobVL4VaKLVfDkwYn0nI"/>
            </div>
            <p class="font-bold text-sm">qBittorrent</p>

            <div class="absolute top-2 right-2 text-primary">
              <span class="material-symbols-outlined text-lg">check_circle</span>
            </div>
          </div>
          <!-- Client Option 2 -->
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <img class="object-contain" alt="Transmission"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB7CxAjne4I-jAYw2E6tP1tg46_ISIeChMAd8RJEviMKwsKr8pQfEE7RiT1W7UN3LYn4HbscR8SCeqG1nPxLvhEbpO1H0JweQfCjJBPB-PvZsKxgc7AvEU6fdZhTXMCayZ1_nnzsEpm47M0czs9Cla0qklWtfWl7tuxBt2hozDM86RL2IOgVfoLlP_Frk8nd36Gv593fYEug3hpuSB7GmiAShGo1gIVV7Y8WjJaJLenIvp-0Y-Kif5YaQ1jTNp9joJxTTZATvP8sE"/>
            </div>
            <p class="font-bold text-sm text-slate-400">Transmission</p>
          </div>
          <!-- Client Option 3 -->
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <img class="object-contain" alt="Deluge"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7UBc2VSE2kkhBTkqiSGUAevbmrIcObB_ZxuLaLSDYDSCBZbabzCLGDCz9TO8Ao5Z57in13eY8oAsv3wIYIErWxZUI1CQ25OtqP4N9OvD0rob_jgkFfLyL06jeuSJ7cWCP8oyZzSDMtLVaYKgX-IRf0Vnel2usT3Dy8zGzuCrN1A3ph6YT9fbbIKbBI-k4WicPCIoAwDU1TRzXsV9371airyLXjX-6oVxEU6wT3RxlKSAA9W45bW63-rMWZEm-aRFVqMoI7bG0DYU"/>
            </div>
            <p class="font-bold text-sm text-slate-400">Deluge</p>
          </div>
          <!-- Client Option 4 -->
          <div
              class="group cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-[#233648] bg-white dark:bg-[#1a2632] hover:border-primary/50 transition-all">
            <div class="size-12 mb-3 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
              <span class="material-symbols-outlined text-4xl text-slate-500">terminal</span>
            </div>
            <p class="font-bold text-sm text-slate-400">JSON Export</p>
          </div>
        </div>
      </section>

      <!-- Configuration Form -->
      <section
          class="flex flex-col gap-6 p-6 rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#16222c]">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <span class="flex items-center justify-center bg-primary text-white size-6 rounded-full text-xs">2</span>
          qBittorrent Configuration
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

        <div class="flex items-center gap-3 mt-4">
          <button
              class="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              @click="goToExportProgressPage">
            <span class="material-symbols-outlined">publish</span>
            Run Export
          </button>
          <button
              class="px-6 py-3 border border-slate-300 dark:border-[#233648] font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">network_check</span>
            Test
          </button>
        </div>
      </section>
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
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-primary">
              <span class="material-symbols-outlined text-lg">settings_suggest</span>
              <h4 class="font-bold text-sm uppercase tracking-wider">qBittorrent Setup</h4>
            </div>
            <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              1. Open qBittorrent and go to <b>Tools &gt; Options</b>.<br/><br/>
              2. Select the <b>Web UI</b> tab on the left sidebar.<br/><br/>
              3. Check <b>"Web User Interface (Remote control)"</b>.<br/><br/>
              4. Note the port (default is 8080) and set a secure username and password.
            </p>
          </div>
          <div class="rounded-lg overflow-hidden border border-slate-200 dark:border-[#233648]">
            <div class="aspect-video relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span class="text-xs text-white font-medium">Web UI Settings Dialog</span>
              </div>
              <img class="w-full h-full object-cover" data-alt="Screenshot of qBittorrent web ui settings panel"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmOV3iitdBFhEr5A16dGP2lKC-Pl9NWOCMAm1gmJbs2PmDwzdQlXpfXRNVuzKuth8xwRi8jPdqQu6qhVjyNSFR8aVgkEcrYnEWcWrvB-mWRAW6Oc45uQHlHVutn0heHXb564l5xwnDDIVrw68RVE37Edn7VaXz6WpqH8_jFQ_a8q1OIhLx6lr5C-4_d7du5kgb8M0NUWdwWaS-1ef9emuv8NBcT2O2C9AibfrE3HKv6aLDPA-XFumKyROwlLu-ZubqOmbJ_G9Bj5o"/>
            </div>
          </div>
          <hr class="border-slate-200 dark:border-[#233648]"/>
          <nav class="space-y-1">
            <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors group"
               href="#">
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">description</span>
              <span class="text-sm font-medium">Full Documentation</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors group"
               href="#">
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">troubleshoot</span>
              <span class="text-sm font-medium">API Troubleshooting</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#233648] transition-colors group"
               href="#">
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">live_help</span>
              <span class="text-sm font-medium">Common Issues</span>
            </a>
          </nav>
          <div class="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p class="text-xs text-primary leading-tight">
              <b>Pro Tip:</b> Use "localhost" if the client is on this machine, otherwise use the static IP address of
              your server.
            </p>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
</style>


<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToExportProgressPage = () => {
  // You can use a string path or a named route object
  router.push('/exportprogress');
};
</script>