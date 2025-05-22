<template>
  <ion-list>
    <MessageListItem v-for="message in messages" :key="message.id" :message="message"/>
  </ion-list>
</template>

<!-- -->
<style scoped>
</style>
<!-- -->
<script setup lang="ts">
import { IonList, } from '@ionic/vue';
import MessageListItem from '@/components/MessageListItem.vue';
import { getMessages, Message } from '@/data/messages';
import { ref } from 'vue';

const messages = ref<Message[]>(getMessages());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>
