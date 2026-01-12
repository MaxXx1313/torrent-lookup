<template>
  <main class="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between items-end gap-4 mb-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Match Results
          Review</h1>
        <p class="text-slate-500 dark:text-[#92adc9] text-base font-normal">Verify the filesystem matches and resolve
          any conflicts before final export.</p>
      </div>
    </div>
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-[#324d67] shadow-sm">
        <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-widest">Total Scanned</p>
        <div class="flex items-center justify-between">
          <p class="text-slate-900 dark:text-white text-3xl font-bold leading-tight">128</p>
          <span class="material-symbols-outlined text-slate-300 dark:text-slate-600">data_table</span>
        </div>
      </div>
      <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-[#324d67] shadow-sm">
        <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-widest">Matches Found</p>
        <div class="flex items-center justify-between">
          <p class="text-slate-900 dark:text-white text-3xl font-bold leading-tight">45</p>
          <p class="text-[#0bda5b] text-sm font-bold flex items-center bg-[#0bda5b]/10 px-2 py-0.5 rounded-full">
            100%</p>
        </div>
      </div>
      <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-orange-200 dark:border-orange-900/30 border-2 shadow-sm">
        <p class="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest">Action Needed</p>
        <div class="flex items-center justify-between">
          <p class="text-orange-600 dark:text-orange-400 text-3xl font-bold leading-tight">3</p>
          <span class="material-symbols-outlined text-orange-500 animate-pulse">warning</span>
        </div>
      </div>
      <div
          class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-[#324d67] shadow-sm">
        <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-widest">Confirmed</p>
        <div class="flex items-center justify-between">
          <p class="text-slate-900 dark:text-white text-3xl font-bold leading-tight">42</p>
          <span class="material-symbols-outlined text-[#0bda5b]">verified</span>
        </div>
      </div>
    </div>
    <!-- Filter Tabs -->
    <div class="mb-6">
      <div class="flex border-b border-slate-200 dark:border-[#324d67] gap-8">
        <a class="flex items-center gap-2 border-b-[3px] border-b-primary text-slate-900 dark:text-white pb-3 pt-4 transition-all"
           href="#">
          <p class="text-sm font-bold leading-normal tracking-[0.015em]">All Results (45)</p>
        </a>
        <a class="flex items-center gap-2 border-b-[3px] border-b-transparent text-slate-400 dark:text-[#92adc9] pb-3 pt-4 hover:text-primary transition-all"
           href="#">
          <p class="text-sm font-bold leading-normal tracking-[0.015em]">Needs Action</p>
          <span class="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
        </a>
      </div>
    </div>
    <!-- Results Table -->
    <div
        class="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-[#324d67] overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
        <tr class="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67]">
          <th class="px-6 py-4 text-slate-500 dark:text-white text-xs font-bold uppercase tracking-wider w-[350px]">
            Torrent File
          </th>
          <th class="px-6 py-4 text-slate-500 dark:text-white text-xs font-bold uppercase tracking-wider">Matched Local
            Path
          </th>
          <th class="px-6 py-4 text-slate-500 dark:text-white text-xs font-bold uppercase tracking-wider w-40 text-center">
            Status
          </th>
          <th class="px-6 py-4 text-slate-500 dark:text-white text-xs font-bold uppercase tracking-wider w-48">
            Selection
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-[#324d67]">

        <!-- Row 1: Confirmed -->
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
          <td class="px-6 py-5">
            <div class="flex flex-col">
              <span
                  class="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-primary transition-colors">ubuntu-22.04-desktop-amd64.iso.torrent</span>
              <span class="text-slate-400 text-xs mt-1">3.4 GB • Added 2h ago</span>
            </div>
          </td>
          <td class="px-6 py-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400 text-sm">folder</span>
              <span class="text-slate-500 dark:text-[#92adc9] text-sm font-medium italic">/downloads/isos/linux/ubuntu-22.04.iso</span>
            </div>
          </td>
          <td class="px-6 py-5 text-center">
            <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              Confirmed
            </div>
          </td>
          <td class="px-6 py-5">
            <button
                class="flex items-center justify-between w-full px-3 h-9 bg-slate-100 dark:bg-[#233648] rounded-lg text-xs font-medium text-slate-500 dark:text-white hover:border-primary border border-transparent transition-all">
              <span class="truncate">Auto-Matched</span>
              <span class="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </td>
        </tr>

        <!-- Row 2: Conflict/Action Needed -->
        <tr class="bg-orange-50/20 dark:bg-orange-950/5 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-colors group border-l-4 border-l-orange-500">
          <td class="px-6 py-5">
            <div class="flex flex-col">
              <span
                  class="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-primary transition-colors">The_Big_Buck_Bunny_4K.torrent</span>
              <span class="text-slate-400 text-xs mt-1">1.2 GB • 2 Matches found</span>
            </div>
          </td>
          <td class="px-6 py-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-orange-400 text-sm">warning</span>
              <span
                  class="text-orange-600 dark:text-orange-400 text-sm font-bold">Conflict: Multiple paths detected</span>
            </div>
          </td>
          <td class="px-6 py-5 text-center">
            <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-bold">
              <span class="material-symbols-outlined text-[14px]">error</span>
              Needs Action
            </div>
          </td>
          <td class="px-6 py-5">
            <div class="relative">
              <button
                  class="flex items-center justify-between w-full px-3 h-9 bg-white dark:bg-[#233648] border-2 border-orange-500/50 rounded-lg text-xs font-bold text-slate-900 dark:text-white hover:border-orange-500 transition-all shadow-sm">
                <span class="truncate">Select Path...</span>
                <span class="material-symbols-outlined text-[16px]">unfold_more</span>
              </button>
            </div>
          </td>
        </tr>

        <!-- Row 3: Confirmed -->
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
          <td class="px-6 py-5">
            <div class="flex flex-col">
              <span
                  class="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-primary transition-colors">debian-11.5.0-amd64-netinst.torrent</span>
              <span class="text-slate-400 text-xs mt-1">380 MB • Verified by checksum</span>
            </div>
          </td>
          <td class="px-6 py-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400 text-sm">folder</span>
              <span class="text-slate-500 dark:text-[#92adc9] text-sm font-medium italic">/media/storage/temp/debian-11.iso</span>
            </div>
          </td>
          <td class="px-6 py-5 text-center">
            <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              Confirmed
            </div>
          </td>
          <td class="px-6 py-5">
            <button
                class="flex items-center justify-between w-full px-3 h-9 bg-slate-100 dark:bg-[#233648] rounded-lg text-xs font-medium text-slate-500 dark:text-white hover:border-primary border border-transparent transition-all">
              <span class="truncate">Manual Fix</span>
              <span class="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </td>
        </tr>

        <!-- Row 4: Missing -->
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group opacity-75">
          <td class="px-6 py-5">
            <div class="flex flex-col">
              <span
                  class="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-primary transition-colors">archlinux-2023.11.01-x86_64.torrent</span>
              <span class="text-slate-400 text-xs mt-1">820 MB • Scan failed</span>
            </div>
          </td>
          <td class="px-6 py-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400 text-sm">question_mark</span>
              <span class="text-slate-400 dark:text-slate-500 text-sm italic">No matching local data found</span>
            </div>
          </td>
          <td class="px-6 py-5 text-center">
            <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span class="material-symbols-outlined text-[14px]">block</span>
              Missing
            </div>
          </td>
          <td class="px-6 py-5">
            <button
                class="flex items-center justify-center gap-2 w-full px-3 h-9 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all border border-primary/20">
              <span class="material-symbols-outlined text-[16px]">search</span>
              <span>Browse...</span>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
    <!-- Bottom Action Bar (Fixed/Sticky behavior simulated with margin) -->
    <div
        class="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
      <div class="flex flex-col"></div>
      <div class="flex items-center gap-4 w-full md:w-auto">
        <button
            class="flex-1 md:flex-none h-12 px-8 bg-white dark:bg-[#233648] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          Back to Scan
        </button>

        <button
            class="flex-1 md:flex-none h-12 px-10 bg-primary text-white rounded-lg font-bold text-base shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            @click="goToExportPage">
          Continue to Export
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToExportPage = () => {
  // You can use a string path or a named route object
  router.push('/export');
};
</script>