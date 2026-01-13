<template>
  <!-- Main Content Area -->
  <main class="flex-1 flex items-center justify-center px-8 py-4 pt-8">
    <div class="layout-content-container flex flex-col flex-1 items-center">
      <!-- Spinning Activity Indicator -->
      <div class="flex gap-8">
        <div class="mb-8 relative">
          <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <div
              class="relative flex items-center justify-center w-24 h-24 rounded-full">

            <div
                class="absolute top-0 left-0 right-0 bottom-0 border-2 rounded-full border-primary/30 border-t-primary animate-rotate-cw"></div>
            <span class="material-symbols-outlined text-4xl text-primary animate-search">search</span>
          </div>
        </div>
        <!-- Headline Section -->
        <div class="space-y-2 mb-8">
          <h1 class="text-white tracking-tight text-4xl font-bold leading-tight">
            Scanning Filesystem...
          </h1>
          <p class="text-[#92adc9]text-sm font-normal leading-normal max-w-lg mx-auto">
            Matching local files with torrent metadata. This may take a while depending on your disk speed and volume
            size.
          </p>
        </div>
      </div>

      <!-- Progress & Path Display Card -->
      <div class="w-full max-w-[720px]  bg-[#1b2a38] rounded-xl p-6 md:p-8 border border-[#233648] shadow-2xl">
        <div class="flex flex-col gap-6">
          <!-- Current Activity Label -->
          <div class="flex justify-between items-end">
            <div class="space-y-1">
              <p class="text-white text-lg font-medium">Scanning directory contents</p>
            </div>
            <div class="text-right">
              <p class="text-[#92adc9] text-base">420 files/sec</p>
            </div>
          </div>
          <!-- Indeterminate Progress Bar -->
          <div class="relative w-full h-3 bg-[#324d67] rounded-full overflow-hidden">
            <div class="absolute inset-0 flex">
              <div class="h-full bg-primary rounded-full"
                   style="width: 40%; animation: slide 2s infinite linear;"></div>
            </div>
          </div>
          <!-- Live Path Display -->
          <div class="bg-[#111a22] rounded-lg p-4 border border-[#233648]">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[#92adc9] text-sm mt-1">folder_open</span>
              <div class="flex-1 overflow-hidden">
                <p class="text-[#92adc9] text-sm font-mono leading-relaxed break-all">
                  /Volumes/HighSpeed_Storage/Media/Movies/Legal_Open_Source_Video_Collection_2024_4K/Scanning_In_Progress...
                </p>
              </div>
            </div>
          </div>
          <!-- Counter Metadata -->
          <div class="flex justify-center items-center gap-8 py-2">
            <div class="text-center">
              <span class="block text-white text-xl font-bold">1,240</span>
              <span class="text-[#92adc9] text-xs uppercase tracking-wide">Files Matched</span>
            </div>
            <div class="w-px h-8 bg-[#233648]"></div>
            <div class="text-center">
              <span class="block text-white text-xl font-bold">14,892</span>
              <span class="text-[#92adc9] text-xs uppercase tracking-wide">Files Found</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div class="mt-12 flex flex-col items-center gap-4">
        <button
            class="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 hover:border-white/20"
            @click="goToResultsPage">
          <span class="material-symbols-outlined text-sm">close</span>
          <span class="font-semibold">Cancel Scan</span>
        </button>
        <p class="text-[#92adc9]/60 text-xs text-center italic">
          Scanning will pause and keep current progress if cancelled.
        </p>
      </div>
    </div>
  </main>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToResultsPage = () => {
  // You can use a string path or a named route object
  router.push('/results');
};
</script>