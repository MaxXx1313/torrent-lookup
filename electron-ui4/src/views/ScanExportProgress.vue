<template>
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col overflow-y-auto">

    <div class="max-w-4xl mx-auto w-full px-8 py-10">
      <!-- Progress State -->
      <div class="mb-10 text-center relative">
        <div
            class="inline-flex items-center justify-center p-3 rounded-full text-primary mb-4 border-2 border-primary/30 border-t-primary">
          <span class="material-symbols-outlined text-3xl animate-rotate-ccw">sync</span>
        </div>
        <h1 class="text-slate-900 dark:text-white text-3xl font-bold leading-tight mb-2">Exporting to
          qBittorrent...</h1>
        <p class="text-slate-500 dark:text-[#92adc9]">Moving matched metadata to your local torrent client instance.</p>
      </div>

      <!-- Progress Bar Component -->
      <div
          class="bg-white dark:bg-[#1a2632] rounded-xl p-8 border border-slate-200 dark:border-[#233648] shadow-sm mb-8">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-end">
            <div class="flex flex-col gap-1">
              <p class="text-slate-900 dark:text-white text-lg font-bold">106 of 142 items exported</p>
              <p class="text-slate-500 dark:text-[#92adc9] text-sm font-normal">Current: <span class="text-primary">/downloads/movies/Interstellar.2014.1080p.mkv</span>
              </p>
            </div>
            <p class="text-primary text-2xl font-bold leading-none">75%</p>
          </div>
          <div class="h-3 w-full rounded-full bg-slate-100 dark:bg-[#324d67] overflow-hidden">
            <div
                class="h-full rounded-full bg-primary transition-all duration-500 shadow-[0_0_15px_rgba(19,127,236,0.4)]"
                style="width: 75%;"></div>
          </div>
        </div>
      </div>
      <!-- Live Log / Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#233648] p-5 rounded-xl">
          <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-1">Status</p>
          <p class="text-primary text-xl font-bold">Processing</p>
        </div>
        <div class="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#233648] p-5 rounded-xl">
          <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-1">Time Elapsed</p>
          <p class="text-slate-900 dark:text-white text-xl font-bold">02:14</p>
        </div>
        <div class="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#233648] p-5 rounded-xl">
          <p class="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-1">Errors</p>
          <p class="text-slate-900 dark:text-white text-xl font-bold">0</p>
        </div>
      </div>
      <!-- Export Log List -->
      <div class="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#233648] rounded-xl overflow-hidden">
        <div
            class="px-6 py-4 border-b border-slate-200 dark:border-[#233648] flex justify-between items-center bg-slate-50 dark:bg-[#1c2a38]">
          <h3 class="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wide">Export Activity Log</h3>
          <span
              class="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-[#233648] text-slate-600 dark:text-[#92adc9]">Live</span>
        </div>
        <div class="p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-xs flex flex-col gap-2">
          <div class="flex gap-3 text-emerald-500">
            <span>[14:22:01]</span>
            <span>SUCCESS: Linked "Blade.Runner.2049.2160p.mkv" to qBittorrent</span>
          </div>
          <div class="flex gap-3 text-emerald-500">
            <span>[14:22:05]</span>
            <span>SUCCESS: Linked "The.Dark.Knight.Rises.Bluray.mp4" to qBittorrent</span>
          </div>
          <div class="flex gap-3 text-emerald-500">
            <span>[14:22:09]</span>
            <span>SUCCESS: Linked "Arrival.2016.1080p.webrip.mkv" to qBittorrent</span>
          </div>
          <div class="flex gap-3 text-emerald-500">
            <span>[14:22:15]</span>
            <span>SUCCESS: Linked "Dune.Part.Two.2024.HDR.mkv" to qBittorrent</span>
          </div>
          <div class="flex gap-3 text-primary animate-pulse">
            <span>[14:22:21]</span>
            <span>EXPORTING: "Interstellar.2014.1080p.mkv" ...</span>
          </div>
        </div>
      </div>


      <!-- Post-Export Success View (Hidden initially or contextually shown) -->
      <!-- Note: This would typically replace the elements above or appear below -->
      <div class="mt-12 pt-12 border-t border-slate-200 dark:border-[#233648]">
        <div
            class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 flex flex-col items-center text-center">
          <div
              class="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
            <span class="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Export Successfully Completed</h2>
          <p class="text-slate-600 dark:text-[#92adc9] mb-8 max-w-md">All selected torrents have been successfully
            mapped and added to your client. You can now start seeding.</p>
          <div class="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
            <div class="bg-white/50 dark:bg-background-dark/50 p-4 rounded-lg">
              <p class="text-2xl font-bold text-primary">142</p>
              <p class="text-xs font-medium text-slate-500 dark:text-[#92adc9] uppercase">Items Matched</p>
            </div>
            <div class="bg-white/50 dark:bg-background-dark/50 p-4 rounded-lg">
              <p class="text-2xl font-bold text-primary">1.2 TB</p>
              <p class="text-xs font-medium text-slate-500 dark:text-[#92adc9] uppercase">Total Data</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
                class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">done_all</span> Finish
            </button>
            <button
                class="bg-slate-200 dark:bg-[#233648] hover:bg-slate-300 dark:hover:bg-[#324d67] text-slate-900 dark:text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">restart_alt</span> Start New Scan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer Meta -->
    <!--
    <footer class="mt-auto py-6 px-8 border-t border-slate-200 dark:border-[#233648] flex justify-between items-center text-xs text-slate-400 dark:text-[#4b6a8a]">
      <p>© 2026 TorrentMatcher. All local data remained private during this scan.</p>
      <div class="flex gap-4">
        <a class="hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a class="hover:text-primary transition-colors" href="#">Documentation</a>
      </div>
    </footer>
    -->
  </main>
</template>

<script setup lang="ts">
</script>
