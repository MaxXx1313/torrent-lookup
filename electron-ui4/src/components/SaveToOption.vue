<template>
  <div class="space-y-1 text-sm">
    <!-- main -->
    <div>
      <span class="ml-1">{{ opt?.saveTo }}</span>
    </div>

    <!-- stats -->
    <div class="text-xs text-slate-500 flex flex-wrap gap-3">
      <span>Files matched: {{ opt?.filesWanted?.length }}</span>
      <span>Files skipped: {{ opt?.filesUnwanted?.length }}</span>
      <span>Score: {{ opt?.score }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TorrentMappingSaveLocation } from "../../../electron-core/core-lib/types.ts";
import { ref, watch } from "vue";

const opt = ref<TorrentMappingSaveLocation>(null);

const props = defineProps<{
  opt: TorrentMappingSaveLocation;
}>();

// react only to a specific property
watch(
    () => props.opt.saveTo,
    (newSaveTo) => {
      opt.value = props.opt;
      console.log('saveTo changed', newSaveTo);
    }
);

opt.value = props.opt;
</script>