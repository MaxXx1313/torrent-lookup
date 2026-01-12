<script setup lang="ts">
</script>
<template>
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto">

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
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">folder_open</span>
                <h3 class="font-bold text-lg">Add Scan Folders</h3>
              </div>

              <button class="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 active:scale-[0.96]">
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
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors group-hover:opacity-100">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Right Column: Exclusions -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="material-symbols-outlined text-primary">do_not_disturb_on</span>
              <h3 class="font-bold text-lg">Exclusions</h3>
            </div>

            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              Ignore files or folders that match these patterns.
              Useful for skipping metadata, samples, or temp files.</p>

            <div class="space-y-4">
              <div class="relative">
                <input
                    class="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-primary focus:border-primary"
                    placeholder="e.g. *.nfo, sample/" type="text"/>
                <button
                    class="absolute right-0 top-0 bottom-0 px-2 py-1 text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center">
                  <span class="material-symbols-outlined text-sm">keyboard_return</span>
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">*.txt</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 flex items-center">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">sample/</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 flex items-center">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">*.log</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 flex items-center">
                    <span class="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div
                    class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-300">@eaDir/</span>
                  <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 flex items-center">
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
            class="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform active:scale-[0.98]">
          <span class="material-symbols-outlined">play_arrow</span>
          Start Scanning
        </button>
      </div>
    </div>
  </main>
</template>